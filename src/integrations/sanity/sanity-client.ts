import {
  SANITY_AUTH_TOKEN,
  SANITY_STUDIO_API_VERSION,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_PROJECT_ID,
} from "astro:env/server";

import { createClient, type SanityClient } from "@sanity/client";

const clientCache = new Map<string, SanityClient>();

/**
 * Get an authenticated Sanity Client
 *
 * @param useCdn Whether or not the client will retrieve content from the edge, set to `false` to hit the live API
 * @returns a fully authenticated Sanity Client for use in server contexts
 */
export function getSanityClient(useCdn: boolean = true): SanityClient {
  const cacheKey = useCdn ? `sanity-client-using-cdn` : `sanity-client-no-cdn`;

  let client = clientCache.get(cacheKey);

  if (typeof client === "undefined") {
    client = createClient({
      projectId: SANITY_STUDIO_PROJECT_ID,
      dataset: SANITY_STUDIO_DATASET,
      apiVersion: SANITY_STUDIO_API_VERSION,
      token: SANITY_AUTH_TOKEN,
      useCdn,
      perspective: "published",
    });
    clientCache.set(cacheKey, client);
  }

  return client;
}
