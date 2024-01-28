import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { homePageQuery, type HomePage, zHomePage } from "@model/homePage";
import { z } from "zod";
import {
  type InternetResource,
  type GetInternetResourcesQueryParams,
  zInternetResource,
  getInternetResourceQuery,
} from "@model/internetResource";
import {
  type Category,
  categoryQuery,
  zCategory,
  zCategoryWithParent,
  getCategoriesQuery,
  getFeaturedTopicsQuery,
} from "@model/category";
import {
  zPopulation,
  type Population,
  populationQuery,
  populationsQuery,
} from "@model/population";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const client = createClient({
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,
  useCdn: true,
  apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION,
});

const imgUrlBuilder = imageUrlBuilder(client);

export function getImageUrl(source: SanityImageSource) {
  return imgUrlBuilder.image(source);
}

export async function getHomePage(): Promise<HomePage> {
  const homePage = await client
    .fetch(homePageQuery)
    .then((result) => zHomePage.parse(result));

  return homePage;
}

export async function getCategorySlugs(): Promise<string[]> {
  return await client
    .fetch(`*[_type == 'category'].slug.current`)
    .then((result) => z.string().array().parse(result));
}

function createParamsObject(params: GetInternetResourcesQueryParams) {
  return {
    ...(params.resourceType !== undefined && { type: params.resourceType }),
    ...(params.categorySlug !== undefined && {
      categorySlug: params.categorySlug,
    }),
    ...(params.populationSlug !== undefined && {
      populationSlug: params.populationSlug,
    }),
  };
}

export async function getInternetResources(
  params: GetInternetResourcesQueryParams,
): Promise<InternetResource[]> {
  const resources = await client
    .fetch(getInternetResourceQuery(params), createParamsObject(params))
    .then((result) => zInternetResource.array().parse(result));

  return resources;
}

// Be mindful of the 'withParent' we implemented for the ResourcePageLayout
export async function getCategory(categorySlug: string): Promise<Category> {
  const category = await client
    .fetch(categoryQuery, { category: categorySlug })
    .then((result) => zCategoryWithParent.parse(result));

  return category;
}

export async function getCategories(): Promise<Category[]> {
  const categories = await client
    .fetch(getCategoriesQuery)
    .then((result) => zCategoryWithParent.array().parse(result));

  return categories;
}

export async function getFeaturedTopics(): Promise<Omit<Category, "parent">[]> {
  const featuredTopics = await client
    .fetch(getFeaturedTopicsQuery)
    .then((result) => zCategory.array().parse(result.topics));

  return featuredTopics;
}

// Populations
export async function getPopulationSlugs(): Promise<string[]> {
  return await client
    .fetch(`*[_type == 'population'].slug.current`)
    .then((result) => z.string().array().parse(result));
}

export async function getPopulation(
  populationSlug: string,
): Promise<Population> {
  const population = await client
    .fetch(populationQuery, { population: populationSlug })
    .then((result) => zPopulation.parse(result));

  return population;
}

export async function getPopulations(): Promise<Population[]> {
  const populations = await client
    .fetch(populationsQuery)
    .then((result) => zPopulation.array().parse(result));

  return populations;
}
