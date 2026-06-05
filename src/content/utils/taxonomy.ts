import type { CollectionKey } from "@content/collections";

/**
 * Taxonomies that own a top-level /[taxonomy]/[slug] page.
 */
export const TAXONOMY_PAGE_KEYS = [
  "causesOfDeath",
  "lossRelationships",
  "themes",
  "demographics",
  "emotionalStates",
  "griefPhases",
  "griefTypes",
  "contentFunctions",
] as const satisfies readonly CollectionKey[];

export type TaxonomyPageKey = (typeof TAXONOMY_PAGE_KEYS)[number];

/**
 * Taxonomies that can appear as filter groups in the resource filter UI.
 * Includes all 8 page-owning taxonomies. Consumers (TaxonomyEntryPage) are
 * expected to exclude the current page's taxonomy from the filter set.
 */
export const TAXONOMY_FILTER_CONFIGS = [
  { key: "causesOfDeath", label: "Cause of Death" },
  { key: "lossRelationships", label: "Loss Relationship" },
  { key: "themes", label: "Theme" },
  { key: "demographics", label: "Demographic" },
  { key: "griefPhases", label: "Grief Phase" },
  { key: "griefTypes", label: "Grief Type" },
  { key: "contentFunctions", label: "Content Function" },
  { key: "emotionalStates", label: "Emotional State" },
] as const satisfies ReadonlyArray<{ key: TaxonomyPageKey; label: string }>;

export type TaxonomyFilterKey = (typeof TAXONOMY_FILTER_CONFIGS)[number]["key"];
