import { z } from "astro:content";

import { zBasicInternetResource } from "@content/model/internetResource";

export const zPodcastEpisode = zBasicInternetResource.extend({
  parentPodcast: z
    .object({
      id: z.string(),
      title: z.string(),
      appleUrl: z.string().url().nullable(),
      spotifyUrl: z.string().url().nullable(),
    })
    .nullable(),
});
