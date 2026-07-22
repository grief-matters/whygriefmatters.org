import { getEntry } from "astro:content";

import type { Link } from "../link";

/**
 * Get a source link for a Website resource
 *
 * @param externalOrgRef
 * @returns source link as `Link` type
 */
export async function getSourceLinkFromExternalOrgRef(externalOrgRef: {
  collection: "externalOrgs";
  id: string;
}) {
  const sourceWebsiteEntry = await getEntry(externalOrgRef);
  return {
    label: sourceWebsiteEntry.data.title,
    url: sourceWebsiteEntry.data.resourceUrl,
  };
}

/**
 * Get a website source from a resource URL
 *
 * @param inputUrl
 * @returns source or null
 */
export function getSourceFromResourceUrl(
  inputUrl: string,
): Link | string | null {
  const excludedUrls: Record<string, string> = {
    "https://apps.apple.com": "Apple App Store",
    "https://podcasts.apple.com": "Apple Podcasts",
    "https://youtube.com": "YouTube",
    "https://www.youtube.com": "YouTube",
  };

  const label = inputUrl.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i)?.[1];
  const url = inputUrl.match(/^(https?:\/\/(?:www\.)?[^\/]+)/i)?.[1];

  // We weren't able to process it for some reason
  if (typeof label === "undefined" || typeof url === "undefined") {
    return null;
  }

  if (Object.keys(excludedUrls).includes(url)) {
    return excludedUrls[inputUrl];
  }

  return {
    label,
    url,
  };
}
