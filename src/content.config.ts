import { defineCollection } from "astro:content";

import basicInternetResourceQuery from "@content/queries/basicInternetResource.groq?raw";
import appsQuery from "@content/queries/apps.groq?raw";
import booksQuery from "@content/queries/books.groq?raw";
import causesOfDeathQuery from "@content/queries/causesOfDeath.groq?raw";
import contentBlocksQuery from "@content/queries/contentBlocks.groq?raw";
import contentFunctionsQuery from "@content/queries/contentFunctions.groq?raw";
import contentGroupsQuery from "@content/queries/contentGroups.groq?raw";
import crisisResourcesQuery from "@content/queries/crisisResources.groq?raw";
import demographicsQuery from "@content/queries/demographics.groq?raw";
import emotionalStatesQuery from "@content/queries/emotionalStates.groq?raw";
import endorsementsQuery from "@content/queries/endorsements.groq?raw";
import essentialServicesQuery from "@content/queries/essentialServices.groq?raw";
import externalOrgsQuery from "@content/queries/externalOrgs.groq?raw";
import formsQuery from "@content/queries/forms.groq?raw";
import griefPhasesQuery from "@content/queries/griefPhases.groq?raw";
import griefTypesQuery from "@content/queries/griefTypes.groq?raw";
import imageAssetsQuery from "@content/queries/imageAssets.groq?raw";
import imageCollectionsQuery from "@content/queries/imageCollections.groq?raw";
import listiclesQuery from "@content/queries/listicles.groq?raw";
import lossRelationshipsQuery from "@content/queries/lossRelationships.groq?raw";
import navigationTreesQuery from "@content/queries/navigationTrees.groq?raw";
import peerSupportsQuery from "@content/queries/peerSupports.groq?raw";
import peopleQuery from "@content/queries/people.groq?raw";
import personGroupsQuery from "@content/queries/personGroups.groq?raw";
import podcastEpisodesQuery from "@content/queries/podcastEpisodes.groq?raw";
import podcastsQuery from "@content/queries/podcasts.groq?raw";
import supportGroupsQuery from "@content/queries/supportGroups.groq?raw";
import therapyResourcesQuery from "@content/queries/therapyResources.groq?raw";
import themesQuery from "@content/queries/themes.groq?raw";
import wdynrnEntriesQuery from "@content/queries/wdynrnEntries.groq?raw";

import { zApp } from "@content/model/app";
import { zBook } from "@content/model/book";
import { zCauseOfDeath } from "@content/model/causeOfDeath";
import { zContentBlock } from "@content/model/contentBlock";
import { zContentFunction } from "@content/model/contentFunction";
import zContentGroup from "@content/model/contentGroup";
import { zCrisisResource } from "@content/model/crisisResource";
import { zDemographic } from "@content/model/demographic";
import { zEmotionalState } from "@content/model/emotionalState";
import { zEndorsement } from "@content/model/endorsement";
import { zEssentialService } from "@content/model/essentialService";
import { zExternalOrg } from "@content/model/externalOrg";
import { zForm } from "@content/model/form";
import { zGriefPhase } from "@content/model/griefPhase";
import { zGriefType } from "@content/model/griefType";
import { zImageAsset } from "@content/model/imageAsset";
import zImageCollection from "@content/model/imageCollection";
import { zListicle } from "@content/model/listicle";
import { zLossRelationship } from "@content/model/lossRelationship";
import { zNavigationTree } from "@content/model/navigationTree";
import { zPeerSupport } from "@content/model/peerSupport";
import zPerson from "@content/model/person";
import zPersonGroup from "@content/model/personGroup";
import { zPodcast } from "@content/model/podcast";
import { zPodcastEpisode } from "@content/model/podcastEpisode";
import { zSupportGroup } from "@content/model/supportGroup";
import { zTherapyResource } from "@content/model/therapyResource";
import { zTheme } from "@content/model/theme";
import { zWdynrnEntry } from "@content/model/wdynrnEntry";

import { loadSanityQuery } from "@content/loaders/sanityQueryLoader";
import { fetchAppleStoreMetadata } from "@content/loaders/appleStoreMetadata";
import { fetchApplePodcastMetadata } from "@content/loaders/applePodcastMetadata";
import { fetchBookMetadata } from "@content/loaders/bookMetadata";
import { knownContentTypes } from "@content/model/contentBlock";
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
  // Internet Resources — shared base schema
  articles: getBasicInternetResourceCollectionDef("article"),
  blogs: getBasicInternetResourceCollectionDef("blog"),
  communities: getBasicInternetResourceCollectionDef("community"),
  courses: getBasicInternetResourceCollectionDef("course"),
  forums: getBasicInternetResourceCollectionDef("forum"),
  memorials: getBasicInternetResourceCollectionDef("memorial"),
  printedMaterials: getBasicInternetResourceCollectionDef("printedMaterial"),
  stories: getBasicInternetResourceCollectionDef("story"),
  videos: getBasicInternetResourceCollectionDef("video"),
  webinars: getBasicInternetResourceCollectionDef("webinar"),

  // Internet Resources — per-type schemas
  apps: defineCollection({
    loader: async () => {
      const results = await loadSanityQuery({ query: appsQuery });

      const enriched = await Promise.allSettled(
        results.map(async (app: { appleUrl: string | null }) => {
          if (app.appleUrl) {
            const metadata = await fetchAppleStoreMetadata(app.appleUrl);
            if (metadata) {
              return {
                ...app,
                appleRating: metadata.averageUserRating,
                appleRatingCount: metadata.userRatingCount,
                applePrice: metadata.formattedPrice,
                appleIconUrl: metadata.artworkUrl512,
              };
            }
          }
          return app;
        }),
      );

      const apps = enriched.map((result, i) =>
        result.status === "fulfilled" ? result.value : results[i],
      );

      const parsed = zApp.array().safeParse(apps);
      if (!parsed.success) {
        throw new Error(
          `App collection validation failed: ${parsed.error.message}`,
        );
      }

      return apps;
    },
    schema: zApp,
  }),
  books: defineCollection({
    loader: async () => {
      const results = await loadSanityQuery({ query: booksQuery });

      const enriched = await Promise.allSettled(
        results.map(async (book: { isbn: string | null }) => {
          if (book.isbn) {
            const metadata = await fetchBookMetadata(book.isbn);
            if (metadata) {
              return { ...book, ...metadata };
            }
          }
          return book;
        }),
      );

      const books = enriched.map((result, i) =>
        result.status === "fulfilled" ? result.value : results[i],
      );

      const parsed = zBook.array().safeParse(books);
      if (!parsed.success) {
        throw new Error(
          `Book collection validation failed: ${parsed.error.message}`,
        );
      }

      return books;
    },
    schema: zBook,
  }),
  crisisResources: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: crisisResourcesQuery,
        schema: zCrisisResource,
      }),
    schema: zCrisisResource,
  }),
  essentialServices: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: essentialServicesQuery,
        schema: zEssentialService,
      }),
    schema: zEssentialService,
  }),
  externalOrgs: defineCollection({
    loader: async () =>
      loadSanityQuery({ query: externalOrgsQuery, schema: zExternalOrg }),
    schema: zExternalOrg,
  }),
  listicles: defineCollection({
    loader: async () =>
      loadSanityQuery({ query: listiclesQuery, schema: zListicle }),
    schema: zListicle,
  }),
  peerSupports: defineCollection({
    loader: async () =>
      loadSanityQuery({ query: peerSupportsQuery, schema: zPeerSupport }),
    schema: zPeerSupport,
  }),
  podcastEpisodes: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: podcastEpisodesQuery,
        schema: zPodcastEpisode,
      }),
    schema: zPodcastEpisode,
  }),
  podcasts: defineCollection({
    loader: async () => {
      const results = await loadSanityQuery({ query: podcastsQuery });

      const enriched = await Promise.allSettled(
        results.map(async (podcast: { appleUrl: string | null }) => {
          if (podcast.appleUrl) {
            const metadata = await fetchApplePodcastMetadata(podcast.appleUrl);
            if (metadata) {
              return {
                ...podcast,
                applePodcastArtworkUrl: metadata.artworkUrl100,
                applePodcastArtistName: metadata.artistName,
                applePodcastTrackCount: metadata.trackCount,
              };
            }
          }
          return podcast;
        }),
      );

      const podcasts = enriched.map((result, i) =>
        result.status === "fulfilled" ? result.value : results[i],
      );

      const parsed = zPodcast.array().safeParse(podcasts);
      if (!parsed.success) {
        throw new Error(
          `Podcast collection validation failed: ${parsed.error.message}`,
        );
      }

      return podcasts;
    },
    schema: zPodcast,
  }),
  supportGroups: defineCollection({
    loader: async () =>
      loadSanityQuery({ query: supportGroupsQuery, schema: zSupportGroup }),
    schema: zSupportGroup,
  }),
  therapyResources: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: therapyResourcesQuery,
        schema: zTherapyResource,
      }),
    schema: zTherapyResource,
  }),

  // Taxonomies
  lossRelationships: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: lossRelationshipsQuery,
        schema: zLossRelationship,
      }),
    schema: zLossRelationship,
  }),
  causesOfDeath: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: causesOfDeathQuery,
        schema: zCauseOfDeath,
      }),
    schema: zCauseOfDeath,
  }),
  themes: defineCollection({
    loader: async () => loadSanityQuery({ query: themesQuery, schema: zTheme }),
    schema: zTheme,
  }),
  demographics: defineCollection({
    loader: async () =>
      loadSanityQuery({ query: demographicsQuery, schema: zDemographic }),
    schema: zDemographic,
  }),
  griefPhases: defineCollection({
    loader: async () =>
      loadSanityQuery({ query: griefPhasesQuery, schema: zGriefPhase }),
    schema: zGriefPhase,
  }),
  griefTypes: defineCollection({
    loader: async () =>
      loadSanityQuery({ query: griefTypesQuery, schema: zGriefType }),
    schema: zGriefType,
  }),
  contentFunctions: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: contentFunctionsQuery,
        schema: zContentFunction,
      }),
    schema: zContentFunction,
  }),
  emotionalStates: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: emotionalStatesQuery,
        schema: zEmotionalState,
      }),
    schema: zEmotionalState,
  }),

  // Supporting documents
  imageAssets: defineCollection({
    loader: async () =>
      loadSanityQuery({ query: imageAssetsQuery, schema: zImageAsset }),
    schema: zImageAsset,
  }),
  navigationTrees: defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: navigationTreesQuery,
        schema: zNavigationTree,
      }),
    schema: zNavigationTree,
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
