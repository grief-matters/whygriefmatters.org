import { getNavigationTree, type NavTreeNode } from "./navigation-tree";

export async function getMainNav(): Promise<NavTreeNode[]> {
  return getNavigationTree("main-navigation-v2");
}
