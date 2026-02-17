import { getEntry, type ReferenceDataEntry } from "astro:content";

import type { Link } from "../link";

/**
 * Creates the requisite parts to create a label for a population with correct grammar in the format 'Resources for...'
 *
 * @param populationId
 * @returns label parts as a string array
 */
export async function makeLabelPartsForPopulationResources(
  populationId: string,
): Promise<Array<string>> {
  const entry = await getEntry("populations", populationId);

  let labelParts = null;
  switch (entry?.data.slug) {
    case "african-american-black":
    case "asian-american-and-pacific-islander":
    case "indigenous-communities":
    case "latino-and-hispanic-americans":
    case "people-with-disabilities":
      labelParts = ["Resources for", entry.data.name];
      break;
    case "lgbtq-community":
      labelParts = ["Resources for the", entry.data.name];
      break;
    default:
      break;
  }

  return labelParts ?? [];
}

/**
 * Get a source link for a Website resource
 *
 * @param websiteRef
 * @returns source link as `Link` type
 */
export async function getSourceLinkFromWebsiteRef(
  websiteRef: ReferenceDataEntry<"websites", string>,
) {
  const sourceWebsiteEntry = await getEntry(websiteRef);
  return {
    label: sourceWebsiteEntry.data.name,
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
