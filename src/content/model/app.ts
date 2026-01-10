import { z } from "astro:content";

import zBaseInternetResource from "@content/model/internetResource";

export default zBaseInternetResource
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
