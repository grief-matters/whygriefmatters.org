import { reference, z } from "astro:content";

import { zImage } from "./image";

/**
 * For ordering and prioritization where needed, these are the most "important" resource types
 */
export const primaryResourceTypes = [
  "article",
  "story",
  "peerSupport",
  "supportGroup",
  "therapyResource",
  "website",
] as const;

/**
 * For ordering and prioritization where needed, these are the most "important" resource types
 */
export const secondaryResourceTypes = [
  "app",
  "blog",
  "book",
  "course",
  "community",
  "forum",
  "memorial",
  "podcast",
  "podcastEpisode",
  "printedMaterial",
  "video",
  "webinar",
] as const;

/**
 * The complete set of Internet Resource types
 */
export const internetResourceTypes = [
  ...primaryResourceTypes,
  ...secondaryResourceTypes,
] as const;
export const zInternetResourceType = z.enum(internetResourceTypes);
export type InternetResourceType = z.infer<typeof zInternetResourceType>;

/**
 * Internet Resource Types that all share a common basic schema.
 * This should shrink over time as we develop the specifics of each type.
 */
export const basicInternetResourceTypes: Array<InternetResourceType> = [
  "article",
  "blog",
  "book",
  "community",
  "course",
  "forum",
  "memorial",
  "peerSupport",
  "podcast",
  "podcastEpisode",
  "printedMaterial",
  "story",
  "supportGroup",
  "therapyResource",
  "video",
  "webinar",
] as const;

/**
 * Use to create manual references where Astro 'astro:content.reference' cannot be used
 */
export const zInternetResourceReference = z.object({
  refType: z.enum(internetResourceTypes),
  refId: z.string(),
});

/**
 * Default export is the standard Zod schema for a basic Internet Resource
 */
export const zBasicInternetResource = z.object({
  id: z.string(),
  title: z.string(),
  updatedAt: z.string().datetime(),
  resourceUrl: z.string().url(),
  description: z.string().nullable(),
  image: zImage.nullable(),
  sourceWebsiteId: reference("websites").nullable(),
  categories: z.array(reference("categories")),
  populations: z.array(reference("populations")),
});
