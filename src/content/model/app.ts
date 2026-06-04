import { z } from "astro/zod";

import { zBasicInternetResource } from "@content/model/internetResource";

export const zApp = zBasicInternetResource
  .extend({
    appleUrl: z.url().nullable(),
    playStoreUrl: z.url().nullable(),
    appleRating: z.number().min(0).max(5).nullable().default(null),
    appleRatingCount: z.number().int().nullable().default(null),
    applePrice: z.string().nullable().default(null),
    appleIconUrl: z.url().nullable().default(null),
  })
  .refine(
    (data) =>
      data.resourceUrl !== null ||
      data.appleUrl !== null ||
      data.playStoreUrl !== null,
    {
      message:
        "At least one of resourceUrl, appleUrl, or playStoreUrl must be provided",
    },
  );
