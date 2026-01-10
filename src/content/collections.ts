import type { CollectionEntry } from "astro:content";
import { collections } from "src/content.config";
import type { InternetResourceType } from "./model/internetResource";

export type CollectionKey = keyof typeof collections;
export const collectionKeys: CollectionKey[] = [
  ...(Object.keys(collections) as CollectionKey[]),
] as const;

export const basicInternetResourceCollectionKeys = [
  "articles",
  "blogs",
  "booklets",
  "books",
  "courses",
  "forums",
  "peerSupports",
  "podcastEpisodes",
  "podcasts",
  "stories",
  "supportGroups",
  "therapyResources",
  "videos",
  // "memorials",
  // "community",
  // "brochures",
  // "webinars",
] as const satisfies readonly CollectionKey[];
export type BasicInternetResourceCollectionKey =
  (typeof basicInternetResourceCollectionKeys)[number];

export const internetResourceCollectionKeys = [
  ...basicInternetResourceCollectionKeys,
  "apps",
  "websites",
] as const satisfies readonly CollectionKey[];
export type InternetResourceCollectionKey =
  (typeof internetResourceCollectionKeys)[number];

export type InternetResourceEntries = Partial<{
  [K in InternetResourceCollectionKey]: Array<CollectionEntry<K>>;
}>;

export const resourceTypeToCollectionKeyMap = {
  // brochure: "brochures",
  // community: "communities",
  // memorial: "memorials",
  // webinar: "webinars",
  app: "apps",
  article: "articles",
  blog: "blogs",
  book: "books",
  booklet: "booklets",
  course: "courses",
  forum: "forums",
  peerSupport: "peerSupports",
  podcast: "podcasts",
  podcastEpisode: "podcastEpisodes",
  story: "stories",
  supportGroup: "supportGroups",
  therapyResource: "therapyResources",
  video: "videos",
  website: "websites",
} as const satisfies Record<InternetResourceType, CollectionKey>;

export const collectionKeyToResourceTypeMap = Object.fromEntries(
  Object.entries(resourceTypeToCollectionKeyMap).map(([key, value]) => [
    value,
    key,
  ]),
) as Record<CollectionKey, InternetResourceType>;
