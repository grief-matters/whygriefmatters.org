import groq from "groq";
import uniqBy from "lodash/uniqBy";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";

import {
  type Category,
  zCategory,
  gCategoriesQuery,
  gFeaturedTopicsQuery,
  gCategoriesByFilterQuery,
} from "@model/category";
import {
  zPopulation,
  type Population,
  populationsQuery,
} from "@model/population";
import {
  gHomePageDataQuery,
  type HomePageData,
  zHomePageData,
} from "@model/homePage";
import { gLogosQuery, zLogo, type Logo } from "@model/logo";
import {
  gCategoryPageQuery,
  zCategoryPageData,
  type CategoryPageData,
} from "@model/categoryPage";
import {
  gResourceTypePagesQuery,
  zResourceTypePagesData,
  type ResourceTypePageData,
} from "@model/resourceTypePage";
import {
  gPopulationsPageData,
  zPopulationPageData,
  type PopulationsPageData,
} from "@model/populationPage";
import { zImage, type SanityImage } from "@model/image";
import {
  gCrisisResourcesQuery,
  type CrisisResource,
  zCrisisResource,
} from "@model/crisisResource";

type ClientQueryParams = {
  resourceType?: string;
  categorySlug?: string;
  populationSlug?: string;
} & (
  | { resourceType: string }
  | { categorySlug: string }
  | { populationSlug: string }
);

const clientQueryParamGroqQueryPartMap: Record<
  keyof ClientQueryParams,
  string
> = {
  resourceType: `_type == $resourceType`,
  categorySlug: `$categorySlug in categories[]->slug.current`,
  populationSlug: `$populationSlug in populations[]->slug.current`,
} as const;

/**
 * Generate a GROQ query filter from a set of params. Params maps to the following query parts:
 *
 * ```
 *   resourceType: `_type == $resourceType`,
 *   categorySlug: `$categorySlug in categories[]->slug.current`,
 *   populationSlug: `$populationSlug in populations[]->slug.current`,
 *```
 *
 * @param params
 * @returns
 */
function getQueryFilter(params: ClientQueryParams): string {
  return Object.keys(params)
    .map((k) => clientQueryParamGroqQueryPartMap[k as keyof ClientQueryParams])
    .join(" && ");
}

/**
 * Sanity JS Client configured with current env variables
 */
export const client = createClient({
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,
  useCdn: true,
  apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION,
});

const imgUrlBuilder = imageUrlBuilder(client);

/**
 * Gets the entire list of categories with parents
 *
 * @returns
 */
export async function getCategories(): Promise<Category[]> {
  const categories = await client
    .fetch(gCategoriesQuery)
    .then((result) => zCategory.array().parse(result));

  return categories;
}

/**
 * Gets a list of categories using a filter query
 *
 * @param filter
 * @returns
 */
export async function getCategoriesByFilter(
  filter: ClientQueryParams,
): Promise<Array<Category>> {
  const categories = await client.fetch(
    gCategoriesByFilterQuery(getQueryFilter(filter)),
    filter,
  );

  const unique = uniqBy(categories, "slug");

  return zCategory.array().parse(unique);
}

/**
 * Gets the entire collection of crisis resources
 *
 * @returns
 */
export async function getCrisisResources(): Promise<CrisisResource[]> {
  const crisisResources = await client
    .fetch(gCrisisResourcesQuery)
    .then((result) => zCrisisResource.array().parse(result));

  return crisisResources;
}

/**
 * Gets the list of Featured Topics
 *
 * @returns
 */
export async function getFeaturedTopics(): Promise<Omit<Category, "parent">[]> {
  const featuredTopics = await client
    .fetch(gFeaturedTopicsQuery)
    .then((result) => zCategory.array().parse(result.topics));

  return featuredTopics;
}

/**
 * Gets all Populations
 *
 * @returns {Population[]}
 */
export async function getPopulations(): Promise<Population[]> {
  const populations = await client
    .fetch(populationsQuery)
    .then((result) => zPopulation.array().parse(result));

  return populations;
}

/**
 * Gets the data object for the Home Page
 *
 * @returns {HomePageData}
 */
export async function getHomePageData(): Promise<HomePageData> {
  const homePage = await client
    .fetch(gHomePageDataQuery)
    .then((result) => zHomePageData.parse(result));

  return homePage;
}

/**
 * Gets an array of Page Data objects for all Categories. Only returns categories that have resources.
 *
 * @returns {CategoryPageData[]}
 */
export async function getCategoryPagesData(): Promise<CategoryPageData[]> {
  const categoryPagesData = await client
    .fetch(gCategoryPageQuery)
    .then((result) => zCategoryPageData.array().parse(result));

  return categoryPagesData.filter((pageData) => pageData.resources.length > 0);
}

/**
 * Gets an array of Populations Pages Data objects
 *
 * @returns
 */
export async function getPopulationPagesData(): Promise<
  Array<PopulationsPageData>
> {
  const populationPagesData = await client
    .fetch(gPopulationsPageData)
    .then((result) => zPopulationPageData.array().parse(result));

  return populationPagesData;
}

/**
 * Fetches a Resource Type Page Data object
 *
 * @returns
 */
export async function getResourceTypePagesData(): Promise<ResourceTypePageData> {
  const resourceTypePageData = await client
    .fetch(gResourceTypePagesQuery)
    .then((result) => zResourceTypePagesData.parse(result));

  return resourceTypePageData;
}

/**
 * Given a Sanity image source, returns a Sanity ImageUrlBuilder object
 *
 * @param source - A Sanity Image Asset
 * @returns {ImageUrlBuilder} The CDN url for the image
 */
export function getImageUrl(source: SanityImageSource): ImageUrlBuilder {
  return imgUrlBuilder.image(source);
}

/**
 * Get the Logo Set
 *
 * @returns
 */
export async function getLogoSet(): Promise<Logo[]> {
  const logoSet = await client
    .fetch(gLogosQuery)
    .then((result) => zLogo.array().parse(result));

  return logoSet;
}

/**
 * Gets a specific collection of fallback images
 *
 * @returns
 */
export async function getFallbackImageCollection(): Promise<SanityImage[]> {
  const query = groq`
    *[_type == "imageCollection" && title == "Generic Fallbacks"].images[]{
      image, 
      "altText": alt
    }
  `;

  return await client
    .fetch(query)
    .then((result) => zImage.array().parse(result));
}
