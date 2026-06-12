import { getCollection } from "astro:content";

import type { NavigationTreeItem } from "@content/model/navigationTree";
import type { StaticNavItem } from "@content/model/staticNavItem";

import { resolveNavItem, type ResolvedNavItem } from "./nav-item";
import { buildCache } from "./cache";

export type NavTreeLeaf = {
  kind: "navItem";
  navItem: ResolvedNavItem;
};

export type NavTreeStatic = {
  kind: "staticNavItem";
} & StaticNavItem;

export type NavTreeGroup = {
  kind: "navItemGroup";
  label: string | null;
  items: NavTreeNode[];
};

export type NavTreeNode = NavTreeLeaf | NavTreeStatic | NavTreeGroup;

async function normalizeNode(
  node: NavigationTreeItem,
): Promise<NavTreeNode | null> {
  if (node.kind === "navItem") {
    const { kind: _kind, ...raw } = node;
    const navItem = await resolveNavItem(raw);
    if (!navItem) {return null;}
    return { kind: "navItem", navItem };
  }

  if (node.kind === "staticNavItem") {
    return {
      kind: "staticNavItem",
      label: node.label,
      url: node.url,
    };
  }

  // navItemGroup — recurse and drop empty groups (depth-4 groups left empty
  // by an editor have nothing useful to render).
  const items: NavTreeNode[] = [];
  for (const child of node.items) {
    const normalized = await normalizeNode(child);
    if (normalized) {items.push(normalized);}
  }
  if (items.length === 0) {return null;}

  return {
    kind: "navItemGroup",
    label: node.label,
    items,
  };
}

/**
 * Returns the normalized navigation tree for the given slug. Memoized so all
 * pages share the same result during a build.
 */
export async function getNavigationTree(
  slug: string,
): Promise<NavTreeNode[]> {
  const cached = buildCache.navTrees.get(slug);
  if (cached) {return cached;}

  const trees = await getCollection(
    "navigationTrees",
    ({ data }) => data.slug === slug,
  );
  if (trees.length === 0) {
    throw new Error(
      `[navigation-tree] Could not find a navigationTree with slug '${slug}'`,
    );
  }
  if (trees.length > 1) {
    throw new Error(
      `[navigation-tree] Found ${trees.length} navigationTrees with slug '${slug}' — expected exactly one`,
    );
  }

  const rawItems = trees[0].data.items;
  const normalized: NavTreeNode[] = [];
  for (const item of rawItems) {
    const node = await normalizeNode(item);
    if (node) {normalized.push(node);}
  }

  buildCache.navTrees.set(slug, normalized);
  return normalized;
}
