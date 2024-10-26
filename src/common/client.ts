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
  type Population,
  zPopulation,
  gPopulationsQuery,
} from "@model/population";
import {
  type HomePageData,
  gHomePageDataQuery,
  zHomePageData,
} from "@model/homePage";
import { gLogosQuery, zLogo, type Logo } from "@model/logo";
import {
  type CategoryPageData,
  gCategoryPageQuery,
  zCategoryPageData,
} from "@model/categoryPage";
import {
  type ResourceTypePageData,
  gResourceTypePagesQuery,
  zResourceTypePagesData,
} from "@model/resourceTypePage";
import {
  type PopulationsPageData,
  gPopulationsPageData,
  zPopulationPageData,
} from "@model/populationPage";
import { zImage, type SanityImage } from "@model/image";
import {
  type CrisisResource,
  gCrisisResourcesQuery,
  zCrisisResource,
} from "@model/crisisResource";
import { zPortableText, type PortableText } from "@model/portableText";
import {
  gCoreContentGroupsQuery,
  zCoreContentGroup,
  type CoreContentGroup,
} from "@model/coreContentGroup";

type ClientQueryParams = {
  resourceType?: string;
  categorySlug?: string;
  populationSlug?: string;
} & (
  | { resourceType: string }
  | { categorySlug: string }
  | { populationSlug: string }
);

export const dataCache: Record<string, any> = {};

/**
 * Maps the parts of a GROQ query filter by key
 */
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
 *  resourceType: `_type == $resourceType`,
 *  categorySlug: `$categorySlug in categories[]->slug.current`,
 *  populationSlug: `$populationSlug in populations[]->slug.current`,
 *```
 *
 * @param params - the raw parameters
 * @returns A query filter that can inserted into a GROQ query
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
  projectId:
    process.env.SANITY_STUDIO_PROJECT_ID ||
    import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset:
    process.env.SANITY_STUDIO_DATASET || import.meta.env.SANITY_STUDIO_DATASET,
  apiVersion:
    process.env.SANITY_STUDIO_API_VERSION ||
    import.meta.env.SANITY_STUDIO_API_VERSION,
  useCdn: true,
});

const imgUrlBuilder = imageUrlBuilder(client);

/**
 * Returns a promise that resolves to the Core Content Groups ot throws a Zod error
 *
 * @returns
 */
export async function getCoreContentGroups(): Promise<CoreContentGroup[]> {
  const coreContentGroups = await client
    .fetch(gCoreContentGroupsQuery)
    .then((result) => zCoreContentGroup.array().parse(result));

  return coreContentGroups;
}

/**
 * Gets the entire list of categories with parents
 *
 * @returns
 */
export async function getCategories(): Promise<Category[]> {
  if (
    typeof dataCache.categories === "undefined" ||
    dataCache.categories === null
  ) {
    const categories = await client
      .fetch(gCategoriesQuery)
      .then((result) => zCategory.array().parse(result));

    dataCache.categories = categories;
  }

  return dataCache.categories;
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
    .fetch(gPopulationsQuery)
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
  if (
    typeof dataCache.categoryPagesData === "undefined" ||
    dataCache.categoryPagesData === null
  ) {
    const categoryPagesData = await client
      .fetch(gCategoryPageQuery)
      .then((result) => zCategoryPageData.array().parse(result));

    dataCache.categoryPagesData = categoryPagesData;
  }

  return dataCache.categoryPagesData;
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
  if (!dataCache.fallbackImageCollection) {
    const query = groq`
      *[_type == "imageCollection" && title == "Generic Fallbacks"].images[]{
        image, 
        "altText": alt
      }
    `;

    const images = await client
      .fetch(query)
      .then((result) => zImage.array().parse(result));

    dataCache.fallbackImageCollection = images;
  }

  return dataCache.fallbackImageCollection;
}

/**
 * Get legal text for footer
 * @todo We probably want to give the footer it's own content type in the future
 */
export async function getSmallPrint(): Promise<PortableText> {
  const query = groq`*[_id == "organization-singleton"][0].smallPrint`;

  return await client
    .fetch(query)
    .then((result) => zPortableText.parse(result));
}
