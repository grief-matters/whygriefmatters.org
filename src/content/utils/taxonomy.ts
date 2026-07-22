import { getEntry, type ReferenceDataEntry } from "astro:content";

import type { CollectionKey } from "@content/collections";
import type { ImageAsset } from "@content/model/imageAsset";
import type {
  TaxonomyReference,
  TaxonomyRefType,
} from "@content/model/taxonomy";

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

/**
 * Maps a taxonomy reference `_type` (singular, as used inside Sanity) to the
 * Astro content-collection key (plural).
 */
export const taxonomyRefTypeToCollectionKey = {
  lossRelationship: "lossRelationships",
  causeOfDeath: "causesOfDeath",
  theme: "themes",
  demographic: "demographics",
  griefPhase: "griefPhases",
  griefType: "griefTypes",
  contentFunction: "contentFunctions",
  emotionalState: "emotionalStates",
} as const satisfies Record<TaxonomyRefType, CollectionKey>;

export type ResolvedTaxonomyRef = {
  type: TaxonomyRefType;
  refId: string;
  slug: string;
  title: string;
};

/**
 * Resolves a `TaxonomyReference` (refType + refId) into a `ResolvedTaxonomyRef`
 * (type + slug + title) by looking up the underlying entry.
 * Returns null if the entry is missing or lacks the required fields.
 */
export async function resolveTaxonomyRef(
  ref: TaxonomyReference,
): Promise<ResolvedTaxonomyRef | null> {
  const collectionKey = taxonomyRefTypeToCollectionKey[ref.refType];
  const entry = await getEntry(
    collectionKey as Parameters<typeof getEntry>[0],
    ref.refId,
  );
  if (!entry) {
    return null;
  }
  const data = entry.data as { slug?: string; title?: string };
  if (!data.slug || !data.title) {
    return null;
  }
  return {
    type: ref.refType,
    refId: ref.refId,
    slug: data.slug,
    title: data.title,
  };
}

/**
 * Resolves the image asset associated with a taxonomy entry. Taxonomy schemas
 * use different field names (`coverImage` on lossRelationship/causeOfDeath/
 * theme; `imageAsset` on demographic; nothing on the rest), so we check both.
 * Returns null when the taxonomy carries no image or the entry is missing.
 */
export async function resolveTaxonomyImage(
  ref: TaxonomyReference,
): Promise<ImageAsset | null> {
  const collectionKey = taxonomyRefTypeToCollectionKey[ref.refType];
  const entry = await getEntry(
    collectionKey as Parameters<typeof getEntry>[0],
    ref.refId,
  );
  if (!entry) {
    return null;
  }
  const data = entry.data as {
    coverImage?: ReferenceDataEntry<"imageAssets", string> | null;
    imageAsset?: ReferenceDataEntry<"imageAssets", string> | null;
  };
  const imageRef = data.coverImage ?? data.imageAsset ?? null;
  if (!imageRef) {
    return null;
  }
  const imageEntry = await getEntry(imageRef);
  return imageEntry?.data ?? null;
}
