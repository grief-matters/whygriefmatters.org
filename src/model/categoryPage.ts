import groq from "groq";
import { z } from "zod";

import { zImage } from "./image";
import {
  gPageResourceListingProjection,
  zExtendedResourceType,
  zInternetResourcePageListing,
} from "./internetResource";
import { getRecursiveSubtopicsProjection, zBaseTopic } from "./topic";

const zFeaturedResource = z.object({
  type: zExtendedResourceType,
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

/*
issue-84: temp removal of 'book' and 'course'
remove from (_type != 'crisisResource' && _type != 'book' && _type != 'course') 
when type should be added back to site
*/
export const gCategoryPageQuery = groq`
*[_type == "category"]{
    ${getRecursiveSubtopicsProjection()},
    "resources": *[^.slug.current in categories[]->slug.current && (_type != 'crisisResource' && _type != 'book' && _type != 'course')]{
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
