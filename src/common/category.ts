import type { Category } from "@model/category";
import startCase from "lodash/startCase";
import { getCategories } from "./client";

export type CategoryTreeItem = Category & {
  children: CategoryTreeItem[];
};

export function buildCategoryTree(
  categories: Category[],
  rootNode?: string,
): CategoryTreeItem[] {
  const categoryMap: Record<string, any> = {};

  // Create a mapping of categories using slug as key
  categories.forEach((c) => {
    categoryMap[c.slug] = { ...c, children: [] };
  });

  // Populate the children arrays
  categories.forEach((category) => {
    if (category.parent) {
      // If the category has a parent, add it as a child to the parent
      const parentSlug = category.parent.slug;
      categoryMap[parentSlug].children.push(categoryMap[category.slug]);
    }
  });

  const categoryMapValues = Object.values(categoryMap);

  if (typeof rootNode === "string") {
    const x = categoryMapValues.find((category) => category.slug === rootNode);
    return [x];
  }

  // Find top-level categories
  const rootCategories: CategoryTreeItem[] = categoryMapValues.filter(
    (category) => !category.parent,
  );

  return rootCategories;
}

export async function getCategoryTree(
  rootNode?: string,
): Promise<CategoryTreeItem[]> {
  const categories = await getCategories();

  const categoryMap: Record<string, CategoryTreeItem> = {};

  // Create a mapping of categories using slug as key
  categories.forEach((c) => {
    categoryMap[c.slug] = { ...c, children: [] };
  });

  // Populate the children arrays
  categories.forEach((category) => {
    if (category.parent) {
      // If the category has a parent, add it as a child to the parent
      const parentSlug = category.parent.slug;
      categoryMap[parentSlug].children.push(categoryMap[category.slug]);
    }
  });

  const categoryMapValues = Object.values(categoryMap);

  if (typeof rootNode === "string") {
    const x = categoryMapValues.find((category) => category.slug === rootNode);
    return x ? [x] : [];
  }

  // Find top-level categories
  const rootCategories: CategoryTreeItem[] = categoryMapValues.filter(
    (category) => !category.parent,
  );

  return rootCategories;
}

/**
 * Given a parentSlug and a child categoryTitle - provide a title that makes sense outside of navigation
 *
 * @param parentSlug
 * @param categoryTitle
 * @returns
 */
export function getFullCategoryName(
  parentSlug: string,
  categoryTitle: string,
): string {
  switch (parentSlug) {
    case "loss-of-a":
      return `Loss of a ${startCase(categoryTitle)}`;
    case "supporting-those-who-have-lost":
      return `Supporting Those Who Have Lost a ${startCase(categoryTitle)}`;
    default:
      return `${startCase(categoryTitle)}`;
  }
}
