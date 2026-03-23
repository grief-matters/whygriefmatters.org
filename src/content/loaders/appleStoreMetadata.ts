export interface AppleStoreMetadata {
  averageUserRating: number;
  userRatingCount: number;
  formattedPrice: string;
  artworkUrl512: string;
}

export function extractAppleAppId(url: string): string | null {
  const match = url.match(/\/id(\d+)/);
  return match ? match[1] : null;
}

export async function fetchAppleStoreMetadata(
  appleUrl: string,
): Promise<AppleStoreMetadata | null> {
  const appId = extractAppleAppId(appleUrl);
  if (!appId) {
    console.warn(
      `[appleStoreMetadata] Could not extract app ID from URL: ${appleUrl}`,
    );
    return null;
  }

  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${appId}`,
    );
    if (!response.ok) {
      console.warn(
        `[appleStoreMetadata] iTunes lookup failed for ID ${appId}: ${response.status}`,
      );
      return null;
    }

    const data = (await response.json()) as {
      results?: {
        averageUserRating?: number;
        userRatingCount?: number;
        formattedPrice?: string;
        artworkUrl512?: string;
      }[];
    };
    const result = data?.results?.[0];
    if (!result) {
      console.warn(
        `[appleStoreMetadata] No results from iTunes lookup for ID ${appId}`,
      );
      return null;
    }

    return {
      averageUserRating: result.averageUserRating ?? 0,
      userRatingCount: result.userRatingCount ?? 0,
      formattedPrice: result.formattedPrice ?? "Free",
      artworkUrl512: result.artworkUrl512 ?? "",
    };
  } catch (error) {
    console.warn(
      `[appleStoreMetadata] Failed to fetch metadata for ${appleUrl}:`,
      error,
    );
    return null;
  }
}
