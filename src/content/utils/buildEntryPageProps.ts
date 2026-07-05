import type { CollectionEntry } from "astro:content";

import {
  type InternetResourceCollectionKey,
  type InternetResourceEntries,
} from "@content/collections";
import type { SanityImage } from "@content/model/image";
import type {
  AudienceRole,
  InternetResourceType,
} from "@content/model/internetResource";
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

export interface AggregateEntryPageData {
  otherResources: InternetResourceEntries;
}

interface BuildEntryPageOptions {
  audience: ReadonlyArray<AudienceRole>;
}

function makeAudienceMatcher(
  audience: ReadonlyArray<AudienceRole>,
): (resource: InternetResourceEntry) => boolean {
  return (resource) => {
    const roles = (resource.data as { audienceRole?: ReadonlyArray<string> })
      .audienceRole;
    if (!roles) {
      return true;
    }
    return roles.some((r) => (audience as ReadonlyArray<string>).includes(r));
  };
}

/**
 * Resolve everything a TaxonomyEntryPage needs to render for a single taxonomy
 * entry. Schema-driven: rich fields (cover image, featured resources) are read
 * only when they exist on the entry's schema, so simple taxonomies get empty
 * arrays / null without special-casing.
 *
 * `audience` restricts the resource set to those whose `audienceRole`
 * intersects the given roles. Resources without an `audienceRole` field
 * (essentialService) are treated as audience-agnostic and always included.
 */
export function buildEntryPageProps(
  entry: CollectionEntry<TaxonomyPageKey>,
  index: ResourceIndex,
  { audience }: BuildEntryPageOptions,
): TaxonomyEntryPageData {
  const coverImage = resolveCoverImage(entry, index);

  const matchesAudience = makeAudienceMatcher(audience);

  const featuredResources = resolveResourceRefs(
    "featuredResources" in entry.data ? entry.data.featuredResources : [],
    index,
  ).filter(matchesAudience);
  const secondaryFeaturedResources = resolveResourceRefs(
    "secondaryFeaturedResources" in entry.data
      ? entry.data.secondaryFeaturedResources
      : [],
    index,
  ).filter(matchesAudience);

  const excludeIds = new Set<string>();
  for (const r of featuredResources) {
    excludeIds.add(r.id);
  }
  for (const r of secondaryFeaturedResources) {
    excludeIds.add(r.id);
  }

  const linkedResources =
    index.resourcesByTaxonomyEntry.get(entry.collection)?.get(entry.id) ?? [];

  const otherResources = groupByCollection(
    linkedResources.filter((r) => !excludeIds.has(r.id) && matchesAudience(r)),
  );

  return {
    coverImage,
    featuredResources,
    secondaryFeaturedResources,
    otherResources,
  };
}

/**
 * Aggregate variant for pages that surface resources from multiple taxonomy
 * entries at once (e.g. /supporting-the-bereaved/pregnancy-and-fertility).
 * Deduplicates resources tagged against more than one of the given entries.
 */
export function buildAggregateEntryPageProps(
  entries: ReadonlyArray<CollectionEntry<TaxonomyPageKey>>,
  index: ResourceIndex,
  { audience }: BuildEntryPageOptions,
): AggregateEntryPageData {
  const matchesAudience = makeAudienceMatcher(audience);

  const seen = new Set<string>();
  const collected: Array<InternetResourceEntry> = [];
  for (const entry of entries) {
    const linked =
      index.resourcesByTaxonomyEntry.get(entry.collection)?.get(entry.id) ?? [];
    for (const resource of linked) {
      if (seen.has(resource.id)) {
        continue;
      }
      if (!matchesAudience(resource)) {
        continue;
      }
      seen.add(resource.id);
      collected.push(resource);
    }
  }

  return { otherResources: groupByCollection(collected) };
}

function resolveCoverImage(
  entry: CollectionEntry<TaxonomyPageKey>,
  index: ResourceIndex,
): SanityImage | null {
  if (!("coverImage" in entry.data)) {
    return null;
  }
  const ref = entry.data.coverImage;
  if (!ref) {
    return null;
  }
  const asset = index.imageAssetsById.get(ref.id);
  if (!asset) {
    return null;
  }
  return { image: asset.data.image, altText: asset.data.alt };
}

function resolveResourceRefs(
  refs: ReadonlyArray<InternetResourceRef>,
  index: ResourceIndex,
): Array<InternetResourceEntry> {
  const result: Array<InternetResourceEntry> = [];
  for (const ref of refs) {
    const resource = index.resourceById.get(ref.refId);
    if (resource) {
      result.push(resource);
    }
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
