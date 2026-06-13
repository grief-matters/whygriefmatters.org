import { kebabCase } from "lodash";

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
 *  - One param key per taxonomy filter type, keyed by the kebab-cased plural
 *    collection key (e.g. `grief-types`, `loss-relationships`) to match what
 *    the in-page resource filter controller reads and what each resource's
 *    `data-resource-*` attrs are keyed by. Value = comma-joined slugs.
 *  - `media-type` param when present, value = comma-joined resource type names.
 *  - `audience-role` param when present, value = comma-joined audience roles.
 *  - `supported-griever` param when present, value = comma-joined griever types.
 *
 * Example:
 *   /cause-of-death/cancer?loss-relationships=parent,sibling&themes=guilt&media-type=podcast,article&audience-role=supporter&supported-griever=child
 */
export function buildNavItemHref(navItem: ResolvedNavItem): string {
  const base = navItem.entryPoint
    ? `/${kebabCase(navItem.entryPoint.type)}/${navItem.entryPoint.slug}`
    : "/explore-resources";
  const params = new URLSearchParams();

  const byType = new Map<ResolvedTaxonomyRef["type"], string[]>();
  for (const f of navItem.filters) {
    const list = byType.get(f.type) ?? [];
    list.push(f.slug);
    byType.set(f.type, list);
  }
  for (const [type, slugs] of byType) {
    params.set(
      kebabCase(taxonomyRefTypeToCollectionKey[type]),
      slugs.join(","),
    );
  }

  if (navItem.mediaTypes?.length) {
    params.set("media-type", navItem.mediaTypes.join(","));
  }

  if (navItem.audienceRole?.length) {
    params.set("audience-role", navItem.audienceRole.join(","));
  }

  if (navItem.supportedGriever?.length) {
    params.set("supported-griever", navItem.supportedGriever.join(","));
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
