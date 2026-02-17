import { z } from "astro:content";

import { zBasicInternetResource } from "@content/model/internetResource";

export const zApp = zBasicInternetResource
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
  );
