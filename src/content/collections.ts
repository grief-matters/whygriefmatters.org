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
  "books",
  "communities",
  "courses",
  "forums",
  "memorials",
  "peerSupports",
  "podcastEpisodes",
  "podcasts",
  "printedMaterials",
  "stories",
  "supportGroups",
  "therapyResources",
  "videos",
  "webinars",
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
  app: "apps",
  article: "articles",
  blog: "blogs",
  book: "books",
  community: "communities",
  course: "courses",
  forum: "forums",
  memorial: "memorials",
  peerSupport: "peerSupports",
  podcast: "podcasts",
  podcastEpisode: "podcastEpisodes",
  printedMaterial: "printedMaterials",
  story: "stories",
  supportGroup: "supportGroups",
  therapyResource: "therapyResources",
  video: "videos",
  webinar: "webinars",
  website: "websites",
} as const satisfies Record<InternetResourceType, CollectionKey>;

export const collectionKeyToResourceTypeMap = Object.fromEntries(
  Object.entries(resourceTypeToCollectionKeyMap).map(([key, value]) => [
    value,
    key,
  ]),
) as Record<CollectionKey, InternetResourceType>;
