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
import formsQuery from "@content/queries/forms.groq?raw";
import endorsementsQuery from "@content/queries/endorsements.groq?raw";
import wdynrnEntriesQuery from "@content/queries/wdynrnEntries.groq?raw";
import crisisResourcesQuery from "@content/queries/crisisResources.groq?raw";
import websitesQuery from "@content/queries/websites.groq?raw";

import { zApp } from "@content/model/app";
import { zCategory } from "@content/model/category";
import zContentBlock from "@content/model/contentBlock";
import zContentGroup from "@content/model/contentGroup";
import zImageCollection from "@content/model/imageCollection";
import zPerson from "@content/model/person";
import zPersonGroup from "@content/model/personGroup";
import { zPopulation } from "@content/model/population";
import { zEndorsement } from "@content/model/endorsement";
import { zForm } from "@content/model/form";
import { zCrisisResource } from "@content/model/crisisResource";
import { zWebsite } from "@content/model/website";
import { zWdynrnEntry } from "@content/model/wdynrnEntry";

import { loadSanityQuery } from "@content/loaders/sanityQueryLoader";
import { knownContentTypes } from "@content/model/contentBlock/contentType";
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

  crisisResources: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: crisisResourcesQuery,
        schema: zCrisisResource,
      }),
    schema: zCrisisResource,
  }),

  // Other Collections
  endorsements: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: endorsementsQuery,
        schema: zEndorsement,
      }),
    schema: zEndorsement,
  }),
  forms: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: formsQuery,
        schema: zForm,
      }),
    schema: zForm,
  }),
  categories: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: categoriesQuery,
        schema: zCategory,
      }),
    schema: zCategory,
  }),
  contentBlocks: defineCollection({
    loader: async () => {
      const results = await loadSanityQuery({ query: contentBlocksQuery });
      for (const block of results) {
        block.content = block.content.filter((item: { contentType: string }) =>
          knownContentTypes.has(item.contentType),
        );
      }
      // Validate after filtering unknown content types
      const parsed = zContentBlock.array().safeParse(results);
      if (!parsed.success) {
        throw new Error(
          `Content block validation failed: ${parsed.error.message}`,
        );
      }
      return results;
    },
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
  wdynrnEntries: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: wdynrnEntriesQuery,
        schema: zWdynrnEntry,
      }),
    schema: zWdynrnEntry,
  }),
};
