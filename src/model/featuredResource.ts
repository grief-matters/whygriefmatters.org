import groq from "groq";
import { z } from "zod";

import { zImage } from "./image";
import { zInternetResourceType } from "./internetResource";

export const zFeaturedResource = z.object({
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

export const gFeaturedResourceProjection = groq`
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
