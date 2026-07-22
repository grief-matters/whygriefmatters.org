import { z } from "astro/zod";

import { zBasicInternetResource } from "@content/model/internetResource";

export const zPodcastEpisode = zBasicInternetResource.extend({
  parentPodcast: z
    .object({
      id: z.string(),
      title: z.string(),
      appleUrl: z.url().nullable(),
      spotifyUrl: z.url().nullable(),
    })
    .nullable(),
});
