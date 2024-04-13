import groq from "groq";
import { z } from "zod";

import { zImage } from "./image";
import {
  gPageResourceListingProjection,
  zInternetResourcePageListing,
  zInternetResourceType,
} from "./internetResource";

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
  }
`;

export const zCategoryPageData = z.object({
  title: z.string(),
  slug: z.string(),
  parent: z
    .object({
      title: z.string(),
      slug: z.string(),
    })
    .nullable(),
  resources: z.array(zInternetResourcePageListing),
  featuredArticles: z.array(zFeaturedResource).nullable(),
  featuredStories: z.array(zFeaturedResource).nullable(),
});

export const gCategoryPageQuery = groq`
*[_type == "category"]{
    title,
    "slug": slug.current,
    parent->{
      title,
      "slug": slug.current,
    },
    "resources": *[^.slug.current in categories[]->slug.current]{
      ${gPageResourceListingProjection}
    },
    featuredArticles[]->{
      ${gFeaturedResourceProjection}
    },
    featuredStories[]->{
      ${gFeaturedResourceProjection}
    }
  }
`;

export type CategoryPageData = z.infer<typeof zCategoryPageData>;
export type CategoryPageFeaturedResource = z.infer<typeof zFeaturedResource>;
