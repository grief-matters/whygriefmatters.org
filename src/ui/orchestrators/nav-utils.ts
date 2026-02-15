import { getCollection, type CollectionEntry } from "astro:content";
import { internetResourceCollectionKeys } from "@content/collections";

export interface CategoryTreeNode {
  id: string;
  slug: string;
  title: string;
  displayTitle: string;
  children: CategoryTreeNode[];
  href?: string;
}

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
 * Builds a Set of "categoryId:populationId" strings for O(1) existence checking.
 * Iterates each resource collection once.
 */
export async function buildResourceExistenceSet(): Promise<Set<string>> {
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

  return existenceSet;
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
 * Builds the "Underserved Communities" top-level navigation node.
 * Children are populations (filtered by underserved: true), each containing
 * a pruned category tree showing only categories with resources for that population.
 */
export async function buildUnderservedCommunitiesNode(
  authoritativeRootCategories: CollectionEntry<"categories">[],
  allCategories: CollectionEntry<"categories">[],
): Promise<CategoryTreeNode> {
  const populations = await getCollection("populations");
  const underservedPopulations = populations.filter(
    (p) => p.data.underserved,
  );

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
