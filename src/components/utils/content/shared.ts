import {
  internetResourceCollectionKeys,
  type InternetResourceCollectionKey,
} from "@content/collections";
import { getCollection } from "astro:content";

/**
 * Builds a Set of "categoryId:populationId" strings for O(1) existence checking.
 * Iterates each resource collection once. Result is memoized for the build.
 */
let cachedExistenceSet: Set<string> | undefined;

export async function buildResourceExistenceSet(): Promise<Set<string>> {
  if (cachedExistenceSet) return cachedExistenceSet;

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

  cachedExistenceSet = existenceSet;
  return existenceSet;
}

/** A partial record of resource collection keys to their counts. */
export type ResourceTypeCounts = Partial<
  Record<InternetResourceCollectionKey, number>
>;
