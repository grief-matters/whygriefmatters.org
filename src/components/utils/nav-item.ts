import kebabCase from "lodash/kebabCase";

import { resourceTypeToCollectionKeyMap } from "@content/collections";
import type {
  AudienceRole,
  InternetResourceType,
  SupportedGriever,
} from "@content/model/internetResource";
import type { NavItem } from "@content/model/navItem";
import {
  resolveTaxonomyRef,
  taxonomyRefTypeToCollectionKey,
  type ResolvedTaxonomyRef,
} from "@content/utils/taxonomy";

export type ResolvedNavItem = {
  label: string | null;
  entryPoint: ResolvedTaxonomyRef | null;
  filters: ResolvedTaxonomyRef[];
  mediaTypes: InternetResourceType[] | null;
  audienceRole: AudienceRole[] | null;
  supportedGriever: SupportedGriever[] | null;
};

/**
 * Normalizes a raw `NavItem` (CMS-shaped) into a `ResolvedNavItem` with
 * fully resolved taxonomy refs. Returns null when the entry-point ref can't
 * be resolved — a nav item pointing at a missing entry has nothing to render.
 */
export async function resolveNavItem(
  raw: NavItem,
): Promise<ResolvedNavItem | null> {
  let entryPoint: ResolvedTaxonomyRef | null = null;
  if (raw.entryPoint) {
    entryPoint = await resolveTaxonomyRef(raw.entryPoint);
    if (!entryPoint) {
      return null;
    }
  }

  const filters: ResolvedTaxonomyRef[] = [];
  for (const f of raw.filters) {
    const resolved = await resolveTaxonomyRef(f);
    if (resolved) {
      filters.push(resolved);
    }
  }

  return {
    label: raw.label,
    entryPoint,
    filters,
    mediaTypes: raw.mediaTypes,
    audienceRole: raw.audienceRole,
    supportedGriever: raw.supportedGriever,
  };
}

/**
 * Build the entry-point URL (with optional query string) for a `ResolvedNavItem`.
 *
 * Encoding:
 *  - When an entry point is set, base is `/{kebab-type}/{slug}` (singular ref
 *    type, matching the page routes under `src/pages/`). Otherwise the nav
 *    item is a filter-only search and base is `/explore-resources`.
 *  - Audience is part of the route, not a query param: when `audienceRole`
 *    does not include `"bereaved"`, the base is prefixed with
 *    `/supporting-the-bereaved`. The CMS forbids mixing `bereaved` with
 *    `supporter`/`professional`, so the split is binary.
 *  - One param key per taxonomy filter type, keyed by the kebab-cased plural
 *    collection key (e.g. `grief-types`, `loss-relationships`) to match what
 *    the in-page resource filter controller reads and what each resource's
 *    `data-resource-*` attrs are keyed by. Value = comma-joined slugs.
 *  - `media-type` param when present, value = comma-joined kebab-cased
 *    collection keys (e.g. `articles`, `podcast-episodes`), matching the
 *    `data-resource-media-type` attrs the filter controller reads — not the
 *    singular InternetResourceType names.
 *  - `supported-griever` param when present, value = comma-joined griever types.
 *
 * Example:
 *   /supporting-the-bereaved/cause-of-death/cancer?loss-relationships=parent,sibling&themes=guilt&media-type=podcasts,articles&supported-griever=child
 */
export function buildNavItemHref(navItem: ResolvedNavItem): string {
  const entryPath = navItem.entryPoint
    ? `/${kebabCase(navItem.entryPoint.type)}/${navItem.entryPoint.slug}`
    : "/explore-resources";
  const supporting =
    navItem.audienceRole !== null &&
    navItem.audienceRole.length > 0 &&
    !navItem.audienceRole.includes("bereaved");
  const base = supporting ? `/supporting-the-bereaved${entryPath}` : entryPath;

  // Build the query string by hand rather than via URLSearchParams.toString():
  // multi-value params are comma-joined, and URLSearchParams would percent-encode
  // the separators to `%2C`. This mirrors the in-page resource filter controller
  // (ResourceListingsOrchestrator's setActiveFilters), which keeps commas literal.
  const parts: string[] = [];
  const pushParam = (key: string, values: string[]) => {
    if (values.length === 0) {
      return;
    }
    const encoded = values.map((v) => encodeURIComponent(v)).join(",");
    parts.push(`${encodeURIComponent(key)}=${encoded}`);
  };

  const byType = new Map<ResolvedTaxonomyRef["type"], string[]>();
  for (const f of navItem.filters) {
    const list = byType.get(f.type) ?? [];
    list.push(f.slug);
    byType.set(f.type, list);
  }
  for (const [type, slugs] of byType) {
    pushParam(kebabCase(taxonomyRefTypeToCollectionKey[type]), slugs);
  }

  if (navItem.mediaTypes?.length) {
    // The resource filter matches on the kebab-cased collection key (e.g.
    // `articles`, `podcast-episodes`) — see resourceFilterAttrs and
    // buildFilterGroups — not the singular InternetResourceType. Map through
    // resourceTypeToCollectionKeyMap so nav-item links match in-page filtering.
    pushParam(
      "media-type",
      navItem.mediaTypes.map((t) =>
        kebabCase(resourceTypeToCollectionKeyMap[t]),
      ),
    );
  }

  if (navItem.supportedGriever?.length) {
    pushParam("supported-griever", navItem.supportedGriever);
  }

  const qs = parts.join("&");
  return qs ? `${base}?${qs}` : base;
}
