import { z } from "astro/zod";

import { zBasicInternetResource } from "./internetResource";

const listOfOptions = [
  "app",
  "article",
  "blog",
  "book",
  "community",
  "course",
  "crisisResource",
  "forum",
  "peerSupport",
  "podcast",
  "story",
  "supportGroup",
  "therapyResource",
  "video",
  "externalOrg",
  "mixed",
] as const;
export const zListOf = z.enum(listOfOptions);
export type ListOf = z.infer<typeof zListOf>;

export const zListicle = zBasicInternetResource.extend({
  listOf: zListOf,
});

export type Listicle = z.infer<typeof zListicle>;
