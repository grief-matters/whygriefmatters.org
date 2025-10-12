import { defineCollection, z } from "astro:content";

import groq from "groq";

import { getClient } from "@common/client";

import {
  gBaseInternetResourceProjection,
  zBaseInternetResource,
} from "./baseInternetResource";

export default defineCollection({
  loader: async () => {
    const query = groq`
      *[_type == 'app']{
        ${gBaseInternetResourceProjection}
        appleUrl,
        playStoreUrl
      }
    `;

    return await getClient()
      .fetch(query)
      .then((result) => result);
  },
  schema: zBaseInternetResource
    .extend({
      resourceUrl: z.string().url().nullable(),
      appleUrl: z.string().url().nullable(),
      playStoreUrl: z.string().url().nullable(),
    })
    .refine(
      (data) =>
        data.resourceUrl !== null ||
        data.appleUrl !== null ||
        data.playStoreUrl !== null,
      {
        message:
          "At least one of resourceUrl, appleAppStore, or googlePlayStore must be provided",
      },
    ),
});
