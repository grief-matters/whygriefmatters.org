import type { CollectionEntry } from "astro:content";

import {
  type InternetResourceCollectionKey,
  type InternetResourceEntries,
} from "@content/collections";
import type { SanityImage } from "@content/model/image";
import type { InternetResourceType } from "@content/model/internetResource";
import type { TaxonomyPageKey } from "@content/utils/taxonomy";
import type { ResourceIndex } from "@content/utils/resourceIndex";

type InternetResourceEntry = CollectionEntry<InternetResourceCollectionKey>;

interface InternetResourceRef {
  refType: InternetResourceType;
  refId: string;
}

export interface TaxonomyEntryPageData {
  coverImage: SanityImage | null;
  featuredResources: Array<InternetResourceEntry>;
  secondaryFeaturedResources: Array<InternetResourceEntry>;
  otherResources: InternetResourceEntries;
}

/**
 * Resolve everything a TaxonomyEntryPage needs to render for a single taxonomy
 * entry. Schema-driven: rich fields (cover image, featured resources) are read
 * only when they exist on the entry's schema, so simple taxonomies get empty
 * arrays / null without special-casing.
 */
export function buildEntryPageProps(
  entry: CollectionEntry<TaxonomyPageKey>,
  index: ResourceIndex,
): TaxonomyEntryPageData {
  const coverImage = resolveCoverImage(entry, index);

  const featuredResources = resolveResourceRefs(
    "featuredResources" in entry.data ? entry.data.featuredResources : [],
    index,
  );
  const secondaryFeaturedResources = resolveResourceRefs(
    "secondaryFeaturedResources" in entry.data
      ? entry.data.secondaryFeaturedResources
      : [],
    index,
  );

  const excludeIds = new Set<string>();
  for (const r of featuredResources) excludeIds.add(r.id);
  for (const r of secondaryFeaturedResources) excludeIds.add(r.id);

  const linkedResources =
    index.resourcesByTaxonomyEntry.get(entry.collection)?.get(entry.id) ?? [];

  const otherResources = groupByCollection(
    linkedResources.filter((r) => !excludeIds.has(r.id)),
  );

  return {
    coverImage,
    featuredResources,
    secondaryFeaturedResources,
    otherResources,
  };
}

function resolveCoverImage(
  entry: CollectionEntry<TaxonomyPageKey>,
  index: ResourceIndex,
): SanityImage | null {
  if (!("coverImage" in entry.data)) return null;
  const ref = entry.data.coverImage;
  if (!ref) return null;
  const asset = index.imageAssetsById.get(ref.id);
  if (!asset) return null;
  return { image: asset.data.image, altText: asset.data.alt };
}

function resolveResourceRefs(
  refs: ReadonlyArray<InternetResourceRef>,
  index: ResourceIndex,
): Array<InternetResourceEntry> {
  const result: Array<InternetResourceEntry> = [];
  for (const ref of refs) {
    const resource = index.resourceById.get(ref.refId);
    if (resource) result.push(resource);
  }
  return result;
}

function groupByCollection(
  resources: ReadonlyArray<InternetResourceEntry>,
): InternetResourceEntries {
  const grouped: Partial<
    Record<InternetResourceCollectionKey, Array<InternetResourceEntry>>
  > = {};
  for (const resource of resources) {
    const key = resource.collection;
    (grouped[key] ??= []).push(resource);
  }
  return grouped as InternetResourceEntries;
}
