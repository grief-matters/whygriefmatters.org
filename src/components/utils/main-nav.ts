import { getCollection, getEntry } from "astro:content";
import { kebabCase } from "lodash";

import type {
  AudienceRole,
  InternetResourceType,
  SupportedGriever,
} from "@content/model/internetResource";
import type { TaxonomyRefType } from "@content/model/navigationTree";

import { buildCache } from "./cache";

/**
 * Maps a `navItem`/`navItemGroup` entry-point taxonomy `_type` (singular,
 * as used inside Sanity) to the Astro content-collection key (plural).
 */
const taxonomyRefTypeToCollectionKey = {
  lossRelationship: "lossRelationships",
  causeOfDeath: "causesOfDeath",
  theme: "themes",
  demographic: "demographics",
  griefPhase: "griefPhases",
  griefType: "griefTypes",
  contentFunction: "contentFunctions",
  emotionalState: "emotionalStates",
} as const satisfies Record<TaxonomyRefType, string>;

export type ResolvedTaxonomyRef = {
  type: TaxonomyRefType;
  slug: string;
  title: string;
};

export type NavTreeLeaf = {
  kind: "navItem";
  label: string | null;
  entryPoint: ResolvedTaxonomyRef | null;
  filters: ResolvedTaxonomyRef[];
  mediaTypes: InternetResourceType[] | null;
  audienceRole: AudienceRole[] | null;
  supportedGriever: SupportedGriever[] | null;
};

export type NavTreeStatic = {
  kind: "staticNavItem";
  label: string;
  url: string;
};

export type NavTreeGroup = {
  kind: "navItemGroup";
  label: string | null;
  items: NavTreeNode[];
};

export type NavTreeNode = NavTreeLeaf | NavTreeStatic | NavTreeGroup;

type RawTaxonomyRef = { refType: TaxonomyRefType; refId: string };
type RawNavItem = {
  kind: "navItem";
  label: string | null;
  entryPoint: RawTaxonomyRef | null;
  filters: RawTaxonomyRef[];
  mediaTypes: InternetResourceType[] | null;
  audienceRole: AudienceRole[] | null;
  supportedGriever: SupportedGriever[] | null;
};
type RawStaticNavItem = {
  kind: "staticNavItem";
  label: string;
  url: string;
};
type RawNavItemGroup = {
  kind: "navItemGroup";
  label: string | null;
  items: Array<RawNavItem | RawStaticNavItem | RawNavItemGroup>;
};
type RawNavNode = RawNavItem | RawStaticNavItem | RawNavItemGroup;

async function resolveTaxonomyRef(
  ref: RawTaxonomyRef,
): Promise<ResolvedTaxonomyRef | null> {
  const collectionKey = taxonomyRefTypeToCollectionKey[ref.refType];
  const entry = await getEntry(
    collectionKey as Parameters<typeof getEntry>[0],
    ref.refId,
  );
  if (!entry) return null;
  const data = entry.data as { slug?: string; title?: string };
  if (!data.slug || !data.title) return null;
  return { type: ref.refType, slug: data.slug, title: data.title };
}

async function normalizeNode(node: RawNavNode): Promise<NavTreeNode | null> {
  if (node.kind === "navItem") {
    let entryPoint: ResolvedTaxonomyRef | null = null;
    if (node.entryPoint) {
      entryPoint = await resolveTaxonomyRef(node.entryPoint);
      if (!entryPoint) return null;
    }

    const filters: ResolvedTaxonomyRef[] = [];
    for (const f of node.filters) {
      const resolved = await resolveTaxonomyRef(f);
      if (resolved) filters.push(resolved);
    }

    return {
      kind: "navItem",
      label: node.label,
      entryPoint,
      filters,
      mediaTypes: node.mediaTypes,
      audienceRole: node.audienceRole,
      supportedGriever: node.supportedGriever,
    };
  }

  if (node.kind === "staticNavItem") {
    return {
      kind: "staticNavItem",
      label: node.label,
      url: node.url,
    };
  }

  // navItemGroup — recurse and drop empty groups (depth-4 groups left empty
  // by an editor have nothing useful to render).
  const items: NavTreeNode[] = [];
  for (const child of node.items) {
    const normalized = await normalizeNode(child);
    if (normalized) items.push(normalized);
  }
  if (items.length === 0) return null;

  return {
    kind: "navItemGroup",
    label: node.label,
    items,
  };
}

/**
 * Build the entry-point URL (with optional query string) for a `NavTreeLeaf`.
 *
 * Encoding:
 *  - When an entry point is set, base is `/{kebab-type}/{slug}`. Otherwise the
 *    leaf is a filter-only search and base is `/explore-resources`.
 *  - One param key per taxonomy filter type, value = comma-joined slugs.
 *  - `media-type` param when present, value = comma-joined resource type names.
 *  - `audience-role` param when present, value = comma-joined audience roles.
 *  - `supported-griever` param when present, value = comma-joined griever types.
 *
 * Example:
 *   /cause-of-death/cancer?loss-relationship=parent,sibling&theme=guilt&media-type=podcast,article&audience-role=supporter&supported-griever=child
 */
export function buildNavItemHref(node: NavTreeLeaf): string {
  const base = node.entryPoint
    ? `/${kebabCase(node.entryPoint.type)}/${node.entryPoint.slug}`
    : "/explore-resources";
  const params = new URLSearchParams();

  const byType = new Map<TaxonomyRefType, string[]>();
  for (const f of node.filters) {
    const list = byType.get(f.type) ?? [];
    list.push(f.slug);
    byType.set(f.type, list);
  }
  for (const [type, slugs] of byType) {
    params.set(kebabCase(type), slugs.join(","));
  }

  if (node.mediaTypes?.length) {
    params.set("media-type", node.mediaTypes.join(","));
  }

  if (node.audienceRole?.length) {
    params.set("audience-role", node.audienceRole.join(","));
  }

  if (node.supportedGriever?.length) {
    params.set("supported-griever", node.supportedGriever.join(","));
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Returns the normalized 'main-navigation' tree. Memoized so all pages share
 * the same result during a build.
 */
export async function getMainNav(): Promise<NavTreeNode[]> {
  if (buildCache.mainNav) {
    return buildCache.mainNav;
  }

  const trees = await getCollection(
    "navigationTrees",
    ({ data }) => data.slug === "main-navigation",
  );
  if (trees.length === 0) {
    throw new Error(
      "[main-nav] Could not find a navigationTree with slug 'main-navigation'",
    );
  }
  if (trees.length > 1) {
    throw new Error(
      `[main-nav] Found ${trees.length} navigationTrees with slug 'main-navigation' — expected exactly one`,
    );
  }

  const rawItems = trees[0].data.items as RawNavNode[];
  const normalized: NavTreeNode[] = [];
  for (const item of rawItems) {
    const node = await normalizeNode(item);
    if (node) normalized.push(node);
  }

  buildCache.mainNav = normalized;
  return normalized;
}
