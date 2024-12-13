import groq from "groq";
import { z } from "zod";

export const primaryResourceTypes = [
  "article",
  "story",
  "peerSupport",
  "supportGroup",
  "therapyResource",
  "website",
] as const;

export const secondaryResourceTypes = [
  "app",
  "blog",
  "book",
  "booklet",
  "brochure",
  "course",
  "forum",
  "memorial",
  "podcast",
  "podcastEpisode",
  "video",
  "webinar",
] as const;

export const internetResourceTypes = [
  ...primaryResourceTypes,
  ...secondaryResourceTypes,
] as const;

export const zPrimaryInternetResourceType = z.enum(primaryResourceTypes);
export const zSecondaryInternetResourceType = z.enum(secondaryResourceTypes);
export const zInternetResourceType = z.enum(internetResourceTypes);

export const zInternetResourcePageListing = z.object({
  title: z.string(),
  lastUpdated: z.string().datetime(),
  description: z.string().nullable(),
  resourceUrl: z.string().url(), // coalesce in query
  sourceWebsite: z
    .object({
      name: z.string(),
      resourceUrl: z.string().url(),
    })
    .nullable(),
  populations: z.array(z.string()).nullable(),
  rating: z.number().nullable(),
  hasSpanishVersion: z.boolean().nullish(),
  type: zInternetResourceType,
});

export const gPageResourceListingProjection = groq`
  "type": _type,
  hasSpanishVersion,
  rating,
  "title": coalesce(title, name),
  description,
  "lastUpdated": _updatedAt,
  "resourceUrl": coalesce(resourceUrl, appleUrl, spotifyUrl, playStoreUrl),
  sourceWebsite->{
    name,
    resourceUrl,
  },
  "populations": populations[]->slug.current
`;

export type PrimaryInternetResourceType = z.infer<
  typeof zPrimaryInternetResourceType
>;
export type SecondaryInternetResourceType = z.infer<
  typeof zSecondaryInternetResourceType
>;
export type InternetResourceType = z.infer<typeof zInternetResourceType>;
export type InternetResourcePageListing = z.infer<
  typeof zInternetResourcePageListing
>;
