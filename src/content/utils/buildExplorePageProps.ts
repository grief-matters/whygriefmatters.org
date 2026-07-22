import type { CollectionEntry } from "astro:content";

import {
  type InternetResourceCollectionKey,
  type InternetResourceEntries,
} from "@content/collections";
import type { ResourceIndex } from "@content/utils/resourceIndex";

type InternetResourceEntry = CollectionEntry<InternetResourceCollectionKey>;

export interface ExplorePageData {
  mainResources: InternetResourceEntries;
}

export function buildExplorePageProps(index: ResourceIndex): ExplorePageData {
  const grouped: Partial<
    Record<InternetResourceCollectionKey, Array<InternetResourceEntry>>
  > = {};
  for (const resource of index.resourceById.values()) {
    const key = resource.collection;
    (grouped[key] ??= []).push(resource);
  }
  return { mainResources: grouped as InternetResourceEntries };
}
