import { getCollection } from "astro:content";

import { type CategoryTreeNode } from "./category";

export const supportCollections = [
  { key: "supportGroups", title: "Support Groups", slug: "support-groups" },
  { key: "peerSupports", title: "Peer Support", slug: "peer-support" },
  {
    key: "therapyResources",
    title: "Therapy/Counselling",
    slug: "therapy-resources",
  },
  { key: "forums", title: "Forums", slug: "forums" },
  { key: "crisisResources", title: "Crisis/Urgent Help", slug: "crisis" },
] as const;

export type SupportCollectionKey = (typeof supportCollections)[number]["key"];

/**
 * Builds a Set of category IDs that have at least 1 resource of the given
 * support collection type.
 */
export async function buildCategoryExistenceForCollection(
  collectionKey: SupportCollectionKey,
): Promise<Set<string>> {
  const resources = await getCollection(collectionKey);
  const categoryIds = new Set<string>();
  for (const resource of resources) {
    for (const catRef of resource.data.categories) {
      categoryIds.add(catRef.id);
    }
  }
  return categoryIds;
}

/**
 * Builds a Set of population IDs that have at least 1 resource of the given
 * support collection type.
 */
export async function buildPopulationExistenceForCollection(
  collectionKey: SupportCollectionKey,
): Promise<Set<string>> {
  const resources = await getCollection(collectionKey);
  const populationIds = new Set<string>();
  for (const resource of resources) {
    for (const popRef of resource.data.populations) {
      populationIds.add(popRef.id);
    }
  }
  return populationIds;
}

/**
 * Recursively prunes a category tree to only include nodes whose category ID
 * is in the existence set (or has a descendant that is).
 * Surviving nodes get href: `/${node.slug}?filter=${supportKey}`.
 */
export function pruneTreeForCollection(
  node: CategoryTreeNode,
  categoryExistenceSet: Set<string>,
  supportKey: string,
): CategoryTreeNode | null {
  const prunedChildren = node.children
    .map((child) =>
      pruneTreeForCollection(child, categoryExistenceSet, supportKey),
    )
    .filter((child): child is CategoryTreeNode => child !== null);

  const hasDirectResources = categoryExistenceSet.has(node.id);

  if (!hasDirectResources && prunedChildren.length === 0) {
    return null;
  }

  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    displayTitle: node.displayTitle,
    children: prunedChildren,
    href:
      supportKey === "crisisResources"
        ? `/get-support/crisis/${node.slug}`
        : `/${node.slug}?filter=${supportKey}#resource-listings-container`,
  };
}

/**
 * Builds the "Get Support" top-level navigation node with tier-3 children
 * for each support type: a "Find" link, a pruned types-of-loss subtree,
 * and a pruned community-specific subtree.
 */
export async function buildGetSupportNode(): Promise<CategoryTreeNode> {
  const populations = await getCollection("populations");

  const tier2Children: CategoryTreeNode[] = [];

  for (const { key, title, slug } of supportCollections) {
    const tier3Children: CategoryTreeNode[] = [];

    // "Find [title]" link
    tier3Children.push({
      id: `${key}-find`,
      slug,
      title: `Find ${title}`,
      displayTitle: `Find ${title}`,
      children: [],
      href: `/get-support/${slug}`,
    });

    // "Community Specific [title]" — pruned population list
    const populationExistence =
      await buildPopulationExistenceForCollection(key);
    const populationChildren = populations
      .filter((p) => populationExistence.has(p.id))
      .map((p) => ({
        id: `${key}-pop-${p.id}`,
        slug: p.data.slug,
        title: p.data.name,
        displayTitle: p.data.name,
        children: [] as CategoryTreeNode[],
        href:
          key === "crisisResources"
            ? `/get-support/crisis/${p.data.slug}`
            : `/get-support/${p.data.slug}?filter=${key}`,
      }));

    if (populationChildren.length > 0) {
      tier3Children.push({
        id: `${key}-communities`,
        slug: `${slug}-communities`,
        title: `Community Specific ${title}`,
        displayTitle: `Community Specific ${title}`,
        children: populationChildren,
      });
    }

    tier2Children.push({
      id: key,
      slug,
      title,
      displayTitle: title,
      children: tier3Children,
    });
  }

  return {
    id: "get-support",
    slug: "get-support",
    title: "Get Support (Groups, Therapy, Crisis)",
    displayTitle: "Get Support",
    children: tier2Children,
  };
}
