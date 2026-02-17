import {
  internetResourceCollectionKeys,
  type InternetResourceCollectionKey,
} from "@content/collections";
import { getCollection } from "astro:content";

import { buildCache } from "../cache";

/**
 * Builds a Set of "categoryId:populationId" strings for O(1) existence checking.
 * Iterates each resource collection once. Result is memoized for the build.
 */
export async function buildResourceExistenceSet(): Promise<Set<string>> {
  if (buildCache.resourceExistence) {
    return buildCache.resourceExistence;
  }

  const existenceSet = new Set<string>();

  for (const key of internetResourceCollectionKeys) {
    const resources = await getCollection(key);
    for (const resource of resources) {
      for (const catRef of resource.data.categories) {
        for (const popRef of resource.data.populations) {
          existenceSet.add(`${catRef.id}:${popRef.id}`);
        }
      }
    }
  }

  buildCache.resourceExistence = existenceSet;
  return existenceSet;
}

/** A partial record of resource collection keys to their counts. */
export type ResourceTypeCounts = Partial<
  Record<InternetResourceCollectionKey, number>
>;
