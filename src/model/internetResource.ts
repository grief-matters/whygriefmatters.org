import groq from "groq";
import { z } from "zod";

export const internetResourceTypes = [
  "app",
  "article",
  "blog",
  "book",
  "booklet",
  "brochure",
  "course",
  "forum",
  "memorial",
  "peerSupport",
  "podcast",
  "podcastEpisode",
  "story",
  "supportGroup",
  "therapyResource",
  "video",
  "webinar",
  "website",
] as const;

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
  type: zInternetResourceType,
});

export const gPageResourceListingProjection = groq`
  "type": _type,
  availableInSpanish,
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

export type InternetResourceType = z.infer<typeof zInternetResourceType>;
export type InternetResourcePageListing = z.infer<
  typeof zInternetResourcePageListing
>;
