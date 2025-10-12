import { z, defineCollection, reference } from "astro:content";

import groq from "groq";

import { getClient } from "@common/client";
import type { InternetResourceType } from "@model/internetResource";

export const loadBaseInternetResourceCollectionByType = async (
  resourceType: InternetResourceType,
) => {
  const query = groq`
    *[_type == $resourceType]{
      ${gBaseInternetResourceProjection}
    }
  `;
  return await getClient()
    .fetch(query, { resourceType })
    .then((result) => result);
};

/**
 * @note Projection includes trailing comma on last line
 */
export const gBaseInternetResourceProjection = groq`
  "id": _id,
  title,
  resourceUrl,
  description,
  "sourceWebsiteId": sourceWebsite->._id,
  "categories": coalesce(categories[]->._id, []),
  "populations": coalesce(populations[]->._id, []),
`;

export const zBaseInternetResource = z.object({
  id: z.string(),
  title: z.string(),
  resourceUrl: z.string().url(),
  description: z.string().nullable(),
  sourceWebsiteId: reference("websites").nullable(),
  categories: z.array(reference("category")),
  populations: z.array(reference("population")),
});

const articles = defineCollection({
  loader: async () => await loadBaseInternetResourceCollectionByType("article"),
  schema: zBaseInternetResource,
});

const blogs = defineCollection({
  loader: async () => await loadBaseInternetResourceCollectionByType("blog"),
  schema: zBaseInternetResource,
});

const books = defineCollection({
  // todo
  loader: async () => await loadBaseInternetResourceCollectionByType("book"),
  schema: zBaseInternetResource,
});

// TODO - should be combined into 'printables' or something
const booklets = defineCollection({
  loader: async () => await loadBaseInternetResourceCollectionByType("booklet"),
  schema: zBaseInternetResource,
});
const brochures = defineCollection({
  loader: async () =>
    await loadBaseInternetResourceCollectionByType("brochure"),
  schema: zBaseInternetResource,
});

const courses = defineCollection({
  loader: async () => await loadBaseInternetResourceCollectionByType("course"),
  schema: zBaseInternetResource,
});

const forums = defineCollection({
  loader: async () => await loadBaseInternetResourceCollectionByType("forum"),
  schema: zBaseInternetResource,
});

const memorials = defineCollection({
  loader: async () =>
    await loadBaseInternetResourceCollectionByType("memorial"),
  schema: zBaseInternetResource,
});

const peerSupports = defineCollection({
  //todo
  loader: async () =>
    await loadBaseInternetResourceCollectionByType("peerSupport"),
  schema: zBaseInternetResource,
});

const podcasts = defineCollection({
  //todo
  loader: async () => await loadBaseInternetResourceCollectionByType("podcast"),
  schema: zBaseInternetResource,
});

const podcastEpisodes = defineCollection({
  //todo
  loader: async () =>
    await loadBaseInternetResourceCollectionByType("podcastEpisode"),
  schema: zBaseInternetResource,
});

const stories = defineCollection({
  loader: async () => await loadBaseInternetResourceCollectionByType("story"),
  schema: zBaseInternetResource,
});

const supportGroups = defineCollection({
  loader: async () =>
    await loadBaseInternetResourceCollectionByType("supportGroup"),
  schema: zBaseInternetResource,
});

const therapyResources = defineCollection({
  loader: async () =>
    await loadBaseInternetResourceCollectionByType("therapyResource"),
  schema: zBaseInternetResource,
});

const videos = defineCollection({
  loader: async () => await loadBaseInternetResourceCollectionByType("video"),
  schema: zBaseInternetResource,
});

const webinars = defineCollection({
  loader: async () => await loadBaseInternetResourceCollectionByType("webinar"),
  schema: zBaseInternetResource,
});

export {
  articles,
  blogs,
  booklets,
  books,
  courses,
  forums,
  memorials,
  peerSupports,
  podcastEpisodes,
  podcasts,
  stories,
  supportGroups,
  therapyResources,
  videos,
  webinars,
};
