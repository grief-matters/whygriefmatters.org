import { getCollection, type CollectionEntry } from "astro:content";

import {
  internetResourceCollectionKeys,
  type InternetResourceCollectionKey,
} from "@content/collections";
import {
  TAXONOMY_PAGE_KEYS,
  type TaxonomyPageKey,
} from "@content/utils/taxonomy";

type InternetResourceEntry = CollectionEntry<InternetResourceCollectionKey>;
type TaxonomyEntry = CollectionEntry<TaxonomyPageKey>;

export interface ResourceIndex {
  /**
   * Inverted index: for each taxonomy, a map of taxonomy-entry id → resources
   * that reference it. Lookup: `index.resourcesByTaxonomyEntry.get(key)?.get(id)`.
   */
  resourcesByTaxonomyEntry: Map<
    TaxonomyPageKey,
    Map<string, Array<InternetResourceEntry>>
  >;
  /**
   * Flat lookup of every internet resource by id. Sanity document `_id`s are
   * globally unique across collections, so a single Map suffices.
   */
  resourceById: Map<string, InternetResourceEntry>;
  /** Flat lookup of every taxonomy entry by id, across all 8 taxonomy collections. */
  taxonomyEntriesById: Map<string, TaxonomyEntry>;
  /** Flat lookup of imageAssets by id — used to resolve cover-image references. */
  imageAssetsById: Map<string, CollectionEntry<"imageAssets">>;
}

let cache: Promise<ResourceIndex> | null = null;

export function getResourceIndex(): Promise<ResourceIndex> {
  return (cache ??= buildResourceIndex());
}

async function buildResourceIndex(): Promise<ResourceIndex> {
  const [resourceCollections, taxonomyCollections, imageAssets] =
    await Promise.all([
      Promise.all(
        internetResourceCollectionKeys.map((key) => getCollection(key)),
      ),
      Promise.all(TAXONOMY_PAGE_KEYS.map((key) => getCollection(key))),
      getCollection("imageAssets"),
    ]);

  const resourceById = new Map<string, InternetResourceEntry>();
  for (const collection of resourceCollections) {
    for (const entry of collection as Array<InternetResourceEntry>) {
      resourceById.set(entry.id, entry);
    }
  }

  const taxonomyEntriesById = new Map<string, TaxonomyEntry>();
  for (const collection of taxonomyCollections) {
    for (const entry of collection as Array<TaxonomyEntry>) {
      taxonomyEntriesById.set(entry.id, entry);
    }
  }

  const imageAssetsById = new Map<string, CollectionEntry<"imageAssets">>();
  for (const asset of imageAssets) {
    imageAssetsById.set(asset.id, asset);
  }

  const resourcesByTaxonomyEntry = new Map<
    TaxonomyPageKey,
    Map<string, Array<InternetResourceEntry>>
  >();
  for (const taxonomyKey of TAXONOMY_PAGE_KEYS) {
    resourcesByTaxonomyEntry.set(taxonomyKey, new Map());
  }

  for (const resource of resourceById.values()) {
    for (const taxonomyKey of TAXONOMY_PAGE_KEYS) {
      if (!(taxonomyKey in resource.data)) continue;
      const refs = (resource.data as Record<string, unknown>)[taxonomyKey];
      if (!Array.isArray(refs)) continue;
      const bucket = resourcesByTaxonomyEntry.get(taxonomyKey)!;
      for (const ref of refs as Array<{ id: string }>) {
        let list = bucket.get(ref.id);
        if (!list) {
          list = [];
          bucket.set(ref.id, list);
        }
        list.push(resource);
      }
    }
  }

  return {
    resourcesByTaxonomyEntry,
    resourceById,
    taxonomyEntriesById,
    imageAssetsById,
  };
}
