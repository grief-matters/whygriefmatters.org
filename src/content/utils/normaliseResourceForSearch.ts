import type { CollectionEntry } from "astro:content";

import type { InternetResourceCollectionKey } from "@content/collections";
import type { ResourceIndex } from "@content/utils/resourceIndex";
import type { PortableText } from "@content/model/portableText";

import { getImageUrlBuilder } from "@sanity-integration/sanity-image-builder";

import { portableTextToPlain } from "@content/utils/portableTextToPlain";
import { getSourceFromResourceUrl } from "@ui/utils/content/content";

export interface NormalisedSource {
  label: string;
  url: string | null;
}

export interface NormalisedResource {
  id: string;
  collection: InternetResourceCollectionKey;
  title: string;
  description: string | PortableText | null;
  descriptionPlain: string;
  searchAliases: string[];
  source: NormalisedSource | null;
  primaryUrl: string | null;
  thumbnailUrl: string | null;
  thumbnailAlt: string;
  typeLabel: string;
  updatedAt: string;
  entry: CollectionEntry<InternetResourceCollectionKey>;
}

const TYPE_LABELS: Record<InternetResourceCollectionKey, string> = {
  apps: "App",
  articles: "Article",
  blogs: "Blog",
  books: "Book",
  communities: "Community",
  courses: "Course",
  crisisResources: "Crisis Resource",
  essentialServices: "Essential Service",
  externalOrgs: "Organisation",
  forums: "Forum",
  listicles: "List",
  memorials: "Memorial",
  peerSupports: "Peer Support",
  podcasts: "Podcast",
  podcastEpisodes: "Podcast Episode",
  printedMaterials: "Printed Material",
  stories: "Story",
  supportGroups: "Support Group",
  therapyResources: "Therapy Resource",
  videos: "Video",
  webinars: "Webinar",
};

const URL_FIELDS = [
  "resourceUrl",
  "appleUrl",
  "playStoreUrl",
  "spotifyUrl",
  "amazonUrl",
  "bookshopUrl",
  "barnesAndNobleUrl",
] as const;

function pickPrimaryUrl(data: Record<string, unknown>): string | null {
  for (const field of URL_FIELDS) {
    const value = data[field];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return null;
}

function imageThumbnailUrl(image: unknown, width = 200): string | null {
  if (!image) {
    return null;
  }
  try {
    return getImageUrlBuilder(image as never)
      .width(width)
      .height(width)
      .fit("crop")
      .url();
  } catch {
    return null;
  }
}

export async function normaliseResourceForSearch(
  entry: CollectionEntry<InternetResourceCollectionKey>,
  index: ResourceIndex,
): Promise<NormalisedResource | null> {
  const data = entry.data as unknown as Record<string, unknown>;

  const primaryUrl = pickPrimaryUrl(data);
  if (!primaryUrl) {
    console.warn(
      `[search] skipping ${entry.collection}/${entry.id} — no resolvable primary URL`,
    );
    return null;
  }

  let source: NormalisedSource | null = null;
  if (entry.collection === "books" && typeof data.author === "string") {
    source = { label: data.author, url: null };
  } else if (
    entry.collection === "podcasts" &&
    typeof data.applePodcastArtistName === "string"
  ) {
    source = { label: data.applePodcastArtistName, url: null };
  } else if (entry.collection !== "externalOrgs") {
    const sourceOrgRef = data.sourceOrgId as
      | { collection: "externalOrgs"; id: string }
      | null
      | undefined;
    if (sourceOrgRef?.id) {
      const orgEntry = index.resourceById.get(sourceOrgRef.id);
      if (orgEntry && orgEntry.collection === "externalOrgs") {
        const orgData = orgEntry.data as unknown as {
          title: string;
          resourceUrl: string;
        };
        source = { label: orgData.title, url: orgData.resourceUrl };
      }
    }
    if (!source) {
      const derived = getSourceFromResourceUrl(primaryUrl);
      if (derived && typeof derived === "object") {
        source = { label: derived.label, url: derived.url };
      } else if (typeof derived === "string") {
        source = { label: derived, url: null };
      }
    }
  }

  let thumbnailUrl: string | null = null;
  const imageAssetRef = data.imageAssetId as
    | { collection: "imageAssets"; id: string }
    | null
    | undefined;
  if (imageAssetRef?.id) {
    const asset = index.imageAssetsById.get(imageAssetRef.id);
    if (asset) {
      thumbnailUrl = imageThumbnailUrl(asset.data.image);
    }
  }
  if (!thumbnailUrl && typeof data.appleIconUrl === "string") {
    thumbnailUrl = data.appleIconUrl;
  }
  if (!thumbnailUrl && typeof data.coverUrl === "string") {
    thumbnailUrl = data.coverUrl;
  }
  if (!thumbnailUrl && typeof data.applePodcastArtworkUrl === "string") {
    thumbnailUrl = data.applePodcastArtworkUrl;
  }
  if (!thumbnailUrl) {
    const logo = data.logo as { image?: unknown } | null | undefined;
    if (logo?.image) {
      thumbnailUrl = imageThumbnailUrl(logo);
    }
  }
  if (!thumbnailUrl && entry.collection !== "externalOrgs") {
    const sourceOrgRef = data.sourceOrgId as
      | { collection: "externalOrgs"; id: string }
      | null
      | undefined;
    if (sourceOrgRef?.id) {
      const orgEntry = index.resourceById.get(sourceOrgRef.id);
      const orgLogo = (orgEntry?.data as { logo?: unknown } | undefined)?.logo;
      if (orgLogo) {
        thumbnailUrl = imageThumbnailUrl(orgLogo);
      }
    }
  }

  const description = (data.description ?? null) as
    | string
    | PortableText
    | null;
  const descriptionPlain = portableTextToPlain(description);

  const searchAliases = Array.isArray(data.searchAliases)
    ? (data.searchAliases as string[]).filter((s) => typeof s === "string")
    : [];

  return {
    id: entry.id,
    collection: entry.collection,
    title: data.title as string,
    description,
    descriptionPlain,
    searchAliases,
    source,
    primaryUrl,
    thumbnailUrl,
    thumbnailAlt: `${data.title as string} thumbnail`,
    typeLabel: TYPE_LABELS[entry.collection],
    updatedAt: data.updatedAt as string,
    entry,
  };
}
