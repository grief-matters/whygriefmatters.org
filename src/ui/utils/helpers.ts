import { zNonEmptyString } from "@content/model/utils";
import { getEntry, type ReferenceDataEntry } from "astro:content";

export function getLocaleDateStringFromIsoString(
  isoStringDateTime: string,
): string | null {
  const d = new Date(isoStringDateTime);
  if (d.toString() === "Invalid Date") {
    return null;
  }

  const dateString = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return dateString;
}

/**
 * Type guard function to determine if a value is a Source object
 * @param link - The value to check
 * @returns True if 'link' is a Link object, false if it's a string
 */
export function isLink(link: unknown): link is Link {
  return (
    (link as Link)?.url !== undefined && (link as Link)?.label !== undefined
  );
}

export async function getSourceLinkFromWebsiteRef(
  websiteRef: ReferenceDataEntry<"websites", string>,
) {
  const sourceWebsiteEntry = await getEntry(websiteRef);
  return {
    label: sourceWebsiteEntry.data.name,
    url: sourceWebsiteEntry.data.resourceUrl,
  };
}

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

export type Link = {
  label: string;
  url: string;
};

export function isNonEmptyString(input: unknown): input is string {
  const parsed = zNonEmptyString.safeParse(input);
  return parsed.success;
}
