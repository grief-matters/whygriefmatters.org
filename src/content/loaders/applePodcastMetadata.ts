import { z } from "astro:content";

const zMetadata = z.object({
  artworkUrl100: z.string().url().optional(),
  artistName: z.string(),
  trackCount: z.number(),
});

const zLookupResponse = z.object({
  resultCount: z.number(),
  results: z.array(zMetadata).min(1),
});

export type ApplePodcastMetadata = z.infer<typeof zMetadata>;

export function extractApplePodcastId(url: string): string | null {
  const match = url.match(/\/id(\d+)/);
  return match ? match[1] : null;
}

export async function fetchApplePodcastMetadata(
  appleUrl: string,
): Promise<ApplePodcastMetadata | null> {
  const podcastId = extractApplePodcastId(appleUrl);
  if (!podcastId) {
    console.warn(
      `[applePodcastMetadata] Could not extract podcast ID from URL: ${appleUrl}`,
    );
    return null;
  }

  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${podcastId}`,
    );

    if (!response.ok) {
      console.warn(
        `[applePodcastMetadata] iTunes lookup failed for ID ${podcastId}: ${response.status}`,
      );
      return null;
    }

    const responseData = await response.json();
    const parsedResponseData = zLookupResponse.safeParse(responseData);

    if (!parsedResponseData.success) {
      console.warn(
        `[applePodcastMetadata] for '${appleUrl}' could not be processed`,
      );
      return null;
    }

    // If we can't fully enrich, let's not bother at all
    return parsedResponseData.data.results[0];
  } catch (error) {
    console.warn(
      `[applePodcastMetadata] Failed to fetch metadata for ${appleUrl}:`,
      error,
    );
    return null;
  }
}
