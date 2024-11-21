import groq from "groq";
import { z } from "zod";

import { zImage } from "./image";
import {
  gPageResourceListingProjection,
  zInternetResourcePageListing,
  zInternetResourceType,
} from "./internetResource";
import { getRecursiveSubtopicsProjection, zBaseTopic } from "./topic";

const zFeaturedResource = z.object({
  type: zInternetResourceType,
  title: z.string(),
  description: z.string().nullable(),
  lastUpdated: z.string().datetime(),
  resourceUrl: z.string().url(),
  sourceWebsite: z
    .object({
      name: z.string(),
      resourceUrl: z.string().url(),
    })
    .nullable(),
  image: zImage.nullable(),
  hasSpanishVersion: z.boolean().nullish(),
});

const gFeaturedResourceProjection = groq`
  "type": _type,
  "title": coalesce(title, name),
  description,
  "lastUpdated": _updatedAt,
  "resourceUrl": coalesce(resourceUrl, appleUrl, spotifyUrl, playStoreUrl),
  sourceWebsite->{
    name,
    resourceUrl,
  },
  image{
    image,
    "altText": alt
  },
  hasSpanishVersion,
`;

export const zCategoryPageData = z
  .object({
    resources: z.array(zInternetResourcePageListing),
    featuredArticles: z.array(zFeaturedResource).nullable(),
    featuredStories: z.array(zFeaturedResource).nullable(),
  })
  .merge(zBaseTopic)
  // TODO - problematic recursive schema
  .extend({ subtopics: z.any() });

export const gCategoryPageQuery = groq`
*[_type == "category"]{
    ${getRecursiveSubtopicsProjection()},
    "resources": *[^.slug.current in categories[]->slug.current && _type != 'crisisResource']{
      ${gPageResourceListingProjection}
    },
    featuredArticles[]->{
      ${gFeaturedResourceProjection}
    },
    featuredStories[]->{
      ${gFeaturedResourceProjection}
    },
  }
`;

export type CategoryPageData = z.infer<typeof zCategoryPageData>;
export type CategoryPageFeaturedResource = z.infer<typeof zFeaturedResource>;
