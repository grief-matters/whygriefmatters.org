import { z } from "astro:content";

import { zBasicInternetResource } from "@content/model/internetResource";

export const zPodcast = zBasicInternetResource
  .extend({
    resourceUrl: z.string().url().nullable(),
    spotifyUrl: z.string().url().nullable(),
    appleUrl: z.string().url().nullable(),
    applePodcastArtworkUrl: z.string().url().nullable().default(null),
    applePodcastArtistName: z.string().nullable().default(null),
    applePodcastTrackCount: z.number().int().nullable().default(null),
  })
  .refine(
    (data) =>
      data.resourceUrl !== null ||
      data.appleUrl !== null ||
      data.spotifyUrl !== null,
    {
      message:
        "At least one of resourceUrl, appleUrl, or spotifyUrl must be provided",
    },
  );
