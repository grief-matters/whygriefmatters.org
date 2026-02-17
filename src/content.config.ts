import { defineCollection } from "astro:content";

import basicInternetResourceQuery from "@content/queries/basicInternetResource.groq?raw";
import appsQuery from "@content/queries/apps.groq?raw";
import categoriesQuery from "@content/queries/categories.groq?raw";
import contentBlocksQuery from "@content/queries/contentBlocks.groq?raw";
import contentGroupsQuery from "@content/queries/contentGroups.groq?raw";
import imageCollectionsQuery from "@content/queries/imageCollections.groq?raw";
import peopleQuery from "@content/queries/people.groq?raw";
import personGroupsQuery from "@content/queries/personGroups.groq?raw";
import populationsQuery from "@content/queries/populations.groq?raw";
import websitesQuery from "@content/queries/websites.groq?raw";

import { zApp } from "@content/model/app";
import { zCategory } from "@content/model/category";
import zContentBlock from "@content/model/contentBlock";
import zContentGroup from "@content/model/contentGroup";
import zImageCollection from "@content/model/imageCollection";
import zPerson from "@content/model/person";
import zPersonGroup from "@content/model/personGroup";
import { zPopulation } from "@content/model/population";
import { zWebsite } from "@content/model/website";

import { loadSanityQuery } from "@content/loaders/sanityQueryLoader";
import {
  zBasicInternetResource,
  type InternetResourceType,
} from "@content/model/internetResource";

/**
 * Produces a standard content collection definition based any give resource type
 *
 * @param resourceType - must be a valid InternetResourceType
 * @returns a preconfigured defineCollection method
 */
function getBasicInternetResourceCollectionDef(
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

export const collections = {
  // Internet Resources collections
  articles: getBasicInternetResourceCollectionDef("article"),
  blogs: getBasicInternetResourceCollectionDef("blog"),
  books: getBasicInternetResourceCollectionDef("book"),
  communities: getBasicInternetResourceCollectionDef("community"),
  courses: getBasicInternetResourceCollectionDef("course"),
  forums: getBasicInternetResourceCollectionDef("forum"),
  memorials: getBasicInternetResourceCollectionDef("memorial"),
  peerSupports: getBasicInternetResourceCollectionDef("peerSupport"),
  podcastEpisodes: getBasicInternetResourceCollectionDef("podcastEpisode"),
  podcasts: getBasicInternetResourceCollectionDef("podcast"),
  printedMaterials: getBasicInternetResourceCollectionDef("printedMaterial"),
  stories: getBasicInternetResourceCollectionDef("story"),
  supportGroups: getBasicInternetResourceCollectionDef("supportGroup"),
  therapyResources: getBasicInternetResourceCollectionDef("therapyResource"),
  videos: getBasicInternetResourceCollectionDef("video"),
  webinars: getBasicInternetResourceCollectionDef("webinar"),
  apps: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: appsQuery,
        schema: zApp,
      }),
    schema: zApp,
  }),
  websites: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: websitesQuery,
        schema: zWebsite,
      }),
    schema: zWebsite,
  }),

  // Other Collections
  categories: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: categoriesQuery,
        schema: zCategory,
      }),
    schema: zCategory,
  }),
  contentBlocks: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: contentBlocksQuery,
        schema: zContentBlock,
      }),
    schema: zContentBlock,
  }),
  contentGroups: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: contentGroupsQuery,
        schema: zContentGroup,
      }),
    schema: zContentGroup,
  }),
  populations: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: populationsQuery,
        schema: zPopulation,
      }),
    schema: zPopulation,
  }),
  people: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: peopleQuery,
        schema: zPerson,
      }),
    schema: zPerson,
  }),
  personGroups: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: personGroupsQuery,
        schema: zPersonGroup,
      }),
    schema: zPersonGroup,
  }),
  imageCollections: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: imageCollectionsQuery,
        schema: zImageCollection,
      }),
    schema: zImageCollection,
  }),
};
