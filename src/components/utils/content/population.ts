import { internetResourceCollectionKeys } from "@content/collections";
import { type CollectionEntry, getCollection } from "astro:content";

import { buildCache } from "../cache";
import {
  buildCategoryTree,
  getAllDescendantCategoryIds,
  type CategoryTreeNode,
} from "./category";
import { buildResourceExistenceSet, type ResourceTypeCounts } from "./shared";

/**
 * Builds the "Underserved Communities" top-level navigation node.
 * Children are populations (filtered by underserved: true), each containing
 * a pruned category tree showing only categories with resources for that population.
 */
export async function buildUnderservedCommunitiesNode(
  authoritativeRootCategories: CollectionEntry<"categories">[],
  allCategories: CollectionEntry<"categories">[],
): Promise<CategoryTreeNode> {
  const populations = await getCollection("populations");
  const underservedPopulations = populations.filter((p) => p.data.underserved);

  const existenceSet = await buildResourceExistenceSet();

  const populationChildren: CategoryTreeNode[] = underservedPopulations
    .map((pop) => {
      // Build a full category tree, then prune for this population
      const prunedCategories = authoritativeRootCategories
        .map((rootCat) => {
          const fullTree = buildCategoryTree(rootCat, allCategories);
          return pruneTreeForPopulation(
            fullTree,
            pop.id,
            pop.data.slug,
            existenceSet,
          );
        })
        .filter((node): node is CategoryTreeNode => node !== null);

      return {
        id: `population-${pop.id}`,
        slug: pop.data.slug,
        title: pop.data.name,
        displayTitle: pop.data.name,
        href: `/${pop.data.slug}`,
        children: prunedCategories,
      };
    })
    .filter((node) => node.children.length > 0);

  return {
    id: "underserved-communities",
    slug: "underserved-communities",
    title: "Underserved Communities",
    displayTitle: "Underserved Communities",
    children: populationChildren,
  };
}

/**
 * Recursively prunes a category tree to only include nodes that have resources
 * for the given population (directly or via descendants).
 * Returns null if the node and all descendants have no resources.
 */
export function pruneTreeForPopulation(
  node: CategoryTreeNode,
  populationId: string,
  populationSlug: string,
  existenceSet: Set<string>,
): CategoryTreeNode | null {
  // Recursively prune children first (bottom-up)
  const prunedChildren = node.children
    .map((child) =>
      pruneTreeForPopulation(child, populationId, populationSlug, existenceSet),
    )
    .filter((child): child is CategoryTreeNode => child !== null);

  const hasDirectResources = existenceSet.has(`${node.id}:${populationId}`);

  // Node survives if it has direct resources OR any descendant does
  if (!hasDirectResources && prunedChildren.length === 0) {
    return null;
  }

  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    displayTitle: node.displayTitle,
    children: prunedChildren,
    href: `/${node.slug}/${populationSlug}`,
  };
}

/**
 * Returns resource type counts for a given category + population (including descendants).
 * Memoized per categoryId:populationId so each combo is computed at most once per build.
 */
export async function getResourceTypeCountsForCategoryAndPopulation(
  categoryId: string,
  populationId: string,
): Promise<ResourceTypeCounts> {
  const cacheKey = `${categoryId}:${populationId}`;
  const cached = buildCache.resourceTypeCountsPopulation.get(cacheKey);
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
    const resources = await getCollection(
      collectionKey,
      ({ data }) =>
        data.categories.some((c) => allCategoryIds.has(c.id)) &&
        data.populations.some((p) => p.id === populationId),
    );

    if (resources.length > 0) {
      counts[collectionKey] = resources.length;
    }
  }

  buildCache.resourceTypeCountsPopulation.set(cacheKey, counts);
  return counts;
}
