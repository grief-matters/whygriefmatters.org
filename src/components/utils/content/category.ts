import { getCollection, type CollectionEntry } from "astro:content";

import { internetResourceCollectionKeys } from "@content/collections";

import { buildCache } from "../cache";
import type { ResourceTypeCounts } from "./shared";

export interface CategoryTreeNode {
  id: string;
  slug: string;
  title: string;
  displayTitle: string;
  children: CategoryTreeNode[];
  href?: string;
}

/**
 * Given a category ID get the IDs of all descendants in the category tree
 *
 * @param categoryId
 * @param allCategories
 * @returns an array of category IDs
 */
export function getAllDescendantCategoryIds(
  categoryId: string,
  allCategories: Array<CollectionEntry<"categories">>,
): Set<string> {
  const categoryIds = new Set<string>([categoryId]);

  const category = allCategories.find((c) => c.id === categoryId);
  if (!category || category.data.subcategories.length === 0) {
    return categoryIds;
  }

  for (const subcategoryRef of category.data.subcategories) {
    const descendantIds = getAllDescendantCategoryIds(
      subcategoryRef.id,
      allCategories,
    );
    descendantIds.forEach((id) => categoryIds.add(id));
  }

  return categoryIds;
}

/**
 * Recursively builds a tree structure from a category and its subcategories.
 */
export function buildCategoryTree(
  category: CollectionEntry<"categories">,
  allCategories: CollectionEntry<"categories">[],
): CategoryTreeNode {
  return {
    id: category.id,
    slug: category.data.slug,
    title: category.data.title,
    displayTitle: category.data.displayTitle ?? category.data.title,
    href: `/${category.data.slug}`,
    children: category.data.subcategories
      .map(({ id }) => allCategories.find((c) => c.id === id))
      .filter((c): c is CollectionEntry<"categories"> => c !== undefined)
      .map((c) => buildCategoryTree(c, allCategories)),
  };
}

/**
 * Returns resource type counts for a category and all its descendants.
 * Memoized per categoryId so each category is computed at most once per build.
 */
export async function getResourceTypeCountsForCategory(
  categoryId: string,
): Promise<ResourceTypeCounts> {
  const cached = buildCache.resourceTypeCounts.get(categoryId);
  if (cached) {
    return cached;
  }

  const categoryEntries = await getCollection("categories");
  const allCategoryIds = getAllDescendantCategoryIds(
    categoryId,
    categoryEntries,
  );

  const counts: ResourceTypeCounts = {};

  for (const collectionKey of internetResourceCollectionKeys) {
    const resources = await getCollection(collectionKey, ({ data }) =>
      data.categories.some((c) => allCategoryIds.has(c.id)),
    );

    if (resources.length > 0) {
      counts[collectionKey] = resources.length;
    }
  }

  buildCache.resourceTypeCounts.set(categoryId, counts);
  return counts;
}
