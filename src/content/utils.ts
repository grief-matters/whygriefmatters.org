import {
  defineCollection,
  getEntry,
  type CollectionEntry,
} from "astro:content";

import {
  zBasicInternetResource,
  type InternetResourceType,
} from "./model/internetResource";
import { loadSanityQuery } from "./loaders/sanityQueryLoader";

import basicInternetResourceQuery from "./queries/basicInternetResource.groq?raw";

export function getBasicInternetResourceCollectionDef(
  resourceType: InternetResourceType,
) {
  return defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: basicInternetResourceQuery,
        queryParams: { resourceType },
        schema: zBasicInternetResource,
      }),
    schema: zBasicInternetResource,
  });
}

/**
 * Recursively get all descendant category IDs (including the given category itself).
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

export async function makeLabelPartsForPopulationResources(
  populationId: string,
): Promise<Array<string>> {
  const entry = await getEntry("populations", populationId);

  let labelParts = null;
  switch (entry?.data.slug) {
    case "african-american-black":
    case "asian-american-and-pacific-islander":
    case "indigenous-communities":
    case "latino-and-hispanic-americans":
    case "people-with-disabilities":
      labelParts = ["Resources for", entry.data.name];
      break;
    case "lgbtq-community":
      labelParts = ["Resources for the", entry.data.name];
    default:
      break;
  }

  return labelParts ?? [];
}
