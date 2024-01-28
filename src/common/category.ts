import type { Category } from "@model/category";

export type CategoryTreeItem = Category & {
  children: CategoryTreeItem[];
};

export function buildCategoryTree(categories: Category[]): CategoryTreeItem[] {
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

  // Find top-level categories
  const rootCategories: CategoryTreeItem[] = Object.values(categoryMap).filter(
    (category) => !category.parent,
  );

  return rootCategories;
}
