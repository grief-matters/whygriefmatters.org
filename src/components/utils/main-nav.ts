import { getCollection, getEntry } from "astro:content";

import type { InternetResourceType } from "@content/model/internetResource";
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
};

export type NavTreeLeaf = {
  kind: "navItem";
  label: string | null;
  entryPoint: ResolvedTaxonomyRef;
  filters: ResolvedTaxonomyRef[];
  mediaTypes: InternetResourceType[] | null;
};

export type NavTreeGroup = {
  kind: "navItemGroup";
  label: string | null;
  items: NavTreeNode[];
};

export type NavTreeNode = NavTreeLeaf | NavTreeGroup;

type RawTaxonomyRef = { refType: TaxonomyRefType; refId: string };
type RawNavItem = {
  kind: "navItem";
  label: string | null;
  entryPoint: RawTaxonomyRef;
  filters: RawTaxonomyRef[];
  mediaTypes: InternetResourceType[] | null;
};
type RawNavItemGroup = {
  kind: "navItemGroup";
  label: string | null;
  items: Array<RawNavItem | RawNavItemGroup>;
};
type RawNavNode = RawNavItem | RawNavItemGroup;

async function resolveTaxonomyRef(
  ref: RawTaxonomyRef,
): Promise<ResolvedTaxonomyRef | null> {
  const collectionKey = taxonomyRefTypeToCollectionKey[ref.refType];
  const entry = await getEntry(
    collectionKey as Parameters<typeof getEntry>[0],
    ref.refId,
  );
  if (!entry) return null;
  const slug = (entry.data as { slug?: string }).slug;
  if (!slug) return null;
  return { type: ref.refType, slug };
}

async function normalizeNode(node: RawNavNode): Promise<NavTreeNode | null> {
  if (node.kind === "navItem") {
    const entryPoint = await resolveTaxonomyRef(node.entryPoint);
    if (!entryPoint) return null;

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
 * Build the `?...` query string for a `NavTreeLeaf`.
 *
 * Encoding:
 *  - One param key per taxonomy filter type, value = comma-joined slugs.
 *  - `mediaType` param when present, value = comma-joined resource type names.
 *
 * Example:
 *   /causeOfDeath/cancer/filter?lossRelationship=parent,sibling&theme=guilt&mediaType=podcast,article
 */
export function buildNavItemHref(node: NavTreeLeaf): string {
  const base = `/${node.entryPoint.type}/${node.entryPoint.slug}/filter`;
  const params = new URLSearchParams();

  const byType = new Map<TaxonomyRefType, string[]>();
  for (const f of node.filters) {
    const list = byType.get(f.type) ?? [];
    list.push(f.slug);
    byType.set(f.type, list);
  }
  for (const [type, slugs] of byType) {
    params.set(type, slugs.join(","));
  }

  if (node.mediaTypes?.length) {
    params.set("mediaType", node.mediaTypes.join(","));
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
