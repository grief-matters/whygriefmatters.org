import { getCollection, type CollectionEntry } from "astro:content";
import { buildCache } from "./cache";
import { type CategoryTreeNode, buildCategoryTree } from "./content/category";
import { buildUnderservedCommunitiesNode } from "./content/population";
import { buildGetSupportNode } from "./content/support";

/**
 * Returns the full nav tree (category trees + underserved communities node).
 * Memoized so all pages share the same result during a build.
 */
export async function getNavTree(): Promise<CategoryTreeNode[]> {
  if (buildCache.navTree) {
    return buildCache.navTree;
  }

  const categories = await getCollection("categories");
  if ((categories ?? []).length === 0) {
    throw new Error("Could not get categories in [MainNav]");
  }

  // Find root categories (those not appearing as children of any other)
  const childIds = new Set(
    categories.flatMap((c) => c.data.subcategories.map((sub) => sub.id)),
  );
  const rootCategories = categories.filter((c) => !childIds.has(c.id));

  // IMPORTANT: This is the ordering determined by project lead
  const authoritativeRootCategorySlugs = [
    "topics",
    "types-of-loss",
    "supporting-the-bereaved",
  ] as const;
  const authoritativeRootCategories = authoritativeRootCategorySlugs
    .map((slug) => rootCategories.find((c) => c.data.slug === slug))
    .filter((c): c is CollectionEntry<"categories"> => c !== undefined);

  // Build the navigation tree
  const navTree: CategoryTreeNode[] = authoritativeRootCategories.map((item) =>
    buildCategoryTree(item, categories),
  );

  // Add the "Get Support" custom node at position 2
  const getSupportNode = buildGetSupportNode();
  navTree.splice(2, 0, getSupportNode);

  // Add the "Underserved Communities" node
  const underservedNode = await buildUnderservedCommunitiesNode(
    authoritativeRootCategories,
    categories,
  );
  if (underservedNode.children.length > 0) {
    navTree.push(underservedNode);
  }

  buildCache.navTree = navTree;
  return navTree;
}
