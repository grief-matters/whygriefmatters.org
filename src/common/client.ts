import {
  SANITY_AUTH_TOKEN,
  SANITY_STUDIO_API_VERSION,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_PROJECT_ID,
} from "astro:env/server";

import groq from "groq";
import uniqBy from "lodash/uniqBy";
import { createClient, SanityClient } from "@sanity/client";
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
  gResourceTypeCountsByTopicQuery,
  gResourceTypePageCommonTemplateQuery,
  gResourceTypePageHeadPartsQuery,
  zRawResourceCounts,
  zResourceTypeCountsByTopic,
  zResourceTypePagesData,
  type ResourceTypeCountsByTopic,
  type ResourceTypePageData,
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
import {
  type CoreContentGroup,
  gCoreContentGroupsQuery,
  zCoreContentGroup,
} from "@model/coreContentGroup";
import {
  type UserEvaluation,
  gUserEvaluation,
  zUserEvaluation,
} from "@model/resourceEvaluation";
import { gFooterDataQuery, zFooterData, type FooterData } from "@model/footer";
import {
  type ContentGroup,
  gContentGroupPagesQuery,
  gContentGroupProjection,
  zContentGroup,
} from "@model/contentGroup";
import { isReservedSlug, templatingSlugs } from "./reserved-slugs";
import { gPersonPagesQuery, zPerson, type Person } from "@model/person";
import {
  type SmartCollectionPage,
  getQueryForCollectionResources,
  gSmartCollectionPagesQuery,
  zSmartCollection,
  zSmartCollectionPage,
} from "@model/smartCollection";
import { zInternetResourcePageListing } from "@model/internetResource";

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
let client: SanityClient | null = null;
let authedClient: SanityClient | null = null;
let imgUrlBuilder: ImageUrlBuilder | null = null;

export function getAuthedClient(useCdn: boolean = false): SanityClient {
  if (authedClient === null) {
    const c = createClient({
      projectId: SANITY_STUDIO_PROJECT_ID,
      dataset: SANITY_STUDIO_DATASET,
      apiVersion: SANITY_STUDIO_API_VERSION,
      token: SANITY_AUTH_TOKEN,
      useCdn: useCdn,
    });
    authedClient = c;
  }

  return authedClient;
}

export function getClient(useCdn: boolean = true): SanityClient {
  if (client === null) {
    const c = createClient({
      projectId: SANITY_STUDIO_PROJECT_ID,
      dataset: SANITY_STUDIO_DATASET,
      apiVersion: SANITY_STUDIO_API_VERSION,
      useCdn: useCdn,
    });
    client = c;
  }

  return client;
}

function getImageBuilder(): ImageUrlBuilder {
  if (imgUrlBuilder === null) {
    const client = getClient();
    const builder = imageUrlBuilder(client);
    imgUrlBuilder = builder;
  }
  return imgUrlBuilder;
}

/**
 * Returns a promise that resolves to the Core Content Groups ot throws a Zod error
 *
 * @returns
 */
export async function getCoreContentGroups(): Promise<CoreContentGroup[]> {
  const client = getClient();
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
    const client = getClient();
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
  const client = getClient();
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
  const client = getClient();
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
  const client = getClient();
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
  const client = getClient();
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
  const client = getClient();
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
    const client = getClient();
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
  const client = getClient();
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
  const client = getClient();
  const commonTemplateData = await client.fetch(
    gResourceTypePageCommonTemplateQuery,
    { contentSlug: templatingSlugs.exploreByTopicBlocksPart },
  );

  const headPartsByType = await client.fetch(gResourceTypePageHeadPartsQuery);

  return zResourceTypePagesData.parse({
    commonTemplateData,
    headPartsByType,
  });
}

export async function getContentGroupPagesData(): Promise<ContentGroup[]> {
  const client = getClient();
  const contentGroupPagesData = await client
    .fetch(gContentGroupPagesQuery)
    .then((result) =>
      zContentGroup
        .array()
        .parse(result)
        .filter((cgp) => cgp.slug === null || !isReservedSlug(cgp.slug)),
    );

  return contentGroupPagesData;
}

/**
 * Fetchs a single Content Group
 */

export async function getContentGroup(slug: string) {
  const client = getClient();

  const query = `
  *[_type == "contentGroup" && slug.current == $slug][0] {
    ${gContentGroupProjection}
  }
`;
  const result = await client.fetch(query, { slug });
  return result;
}

export async function getPersonPagesData(): Promise<Person[]> {
  const client = getClient();
  const result = await client
    .fetch(gPersonPagesQuery)
    .then((result) => zPerson.array().parse(result));

  return result;
}

/**
 * Given a Sanity image source, returns a Sanity ImageUrlBuilder object
 *
 * @param source - A Sanity Image Asset
 * @returns {ImageUrlBuilder} The CDN url for the image
 */
export function getImageUrlBuilder(source: SanityImageSource): ImageUrlBuilder {
  const imgUrlBuilder = getImageBuilder();
  return imgUrlBuilder?.image(source);
}

/**
 * Get the Logo Set
 *
 * @returns
 */
export async function getLogoSet(): Promise<Logo[]> {
  const client = getClient();
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

    const client = getClient();
    const images = await client
      .fetch(query)
      .then((result) => zImage.array().parse(result));

    dataCache.fallbackImageCollection = images;
  }

  return dataCache.fallbackImageCollection;
}

/**
 * Gets legal and copyright text for footer from org
 *
 * @returns - All data needed to build the footer with copyright and legal
 */
export async function getFooterData(): Promise<FooterData> {
  const client = getClient();
  const data = await client
    .fetch(gFooterDataQuery)
    .then((result) => zFooterData.parse(result));

  return data;
}

/**
 * Get an Evaluation of a Resource by a specific User
 * @param userId
 * @param resourceId
 * @returns The details of the resource along with the evaluation - if one exists. `evaluationDetails` will be `null` if the user is yet to evaluate the resource
 */
export async function getUserEvaluation(
  userId: string,
  resourceId: string,
): Promise<UserEvaluation> {
  const client = getAuthedClient(false);
  const userEvaluation = await client
    .fetch(gUserEvaluation, { userId, resourceId })
    .then((result) => zUserEvaluation.parse(result));

  return userEvaluation;
}

export async function updateUserEvaluation(
  id: string,
  rating: number,
  comment: string | null,
) {
  const client = getAuthedClient(false);

  return comment
    ? await client
        .patch(id)
        .set({ rating: Number(rating), comment })
        .commit()
    : await client
        .patch(id)
        .set({ rating: Number(rating) })
        .unset(["comment"])
        .commit();
}

export async function createUserEvaluation(
  userId: string,
  resourceId: string,
  rating: number,
  comment: string | null,
) {
  const client = getAuthedClient();

  return await client.create({
    _type: "resourceEvaluation",
    userId,
    resourceId,
    rating,
    comment: comment ?? undefined,
  });
}

export async function getResourceCountsByTopic(): Promise<ResourceTypeCountsByTopic> {
  if (!dataCache.resourceTypeCountsByTopic) {
    const client = getClient();
    const result = await client
      .fetch(gResourceTypeCountsByTopicQuery)
      .then((result) => {
        const parsed = zRawResourceCounts.array().parse(result);

        const obj: ResourceTypeCountsByTopic = {};

        parsed.forEach(({ slug, ...rest }) => {
          obj[slug] = { ...rest };
        });

        return obj;
      })
      .catch((err) =>
        console.error(
          "Could not parse result of 'gResourceTypeCountsByTopicQuery'",
          err,
        ),
      );

    const resourceCountsByTopic = zResourceTypeCountsByTopic.parse(result);
    dataCache.resourceTypeCountsByTopic = resourceCountsByTopic;
  }

  return dataCache.resourceTypeCountsByTopic;
}

export async function getSmartCollectionPagesData(): Promise<
  SmartCollectionPage[]
> {
  const client = getClient();

  try {
    // Get the raw collections
    const smartCollections = await client
      .fetch(gSmartCollectionPagesQuery)
      .then((result) => zSmartCollection.array().parse(result));

    // Map over the collections and return a promise for each enriched collection
    const smartCollectionPagesPromises = smartCollections.map(
      async (sCollection) => {
        const query = getQueryForCollectionResources(sCollection);

        const resources = await client.fetch(query).then((result) => {
          return zInternetResourcePageListing.array().parse(result);
        });

        return {
          ...sCollection,
          resources,
        };
      },
    );

    const results = await Promise.all(smartCollectionPagesPromises);

    return zSmartCollectionPage.array().parse(results);
  } catch (err) {
    console.error("Error in [getSmartCollectionPagesData]:");
    console.error(err);
  }

  return [];
}

getResourceCountsByTopic();
