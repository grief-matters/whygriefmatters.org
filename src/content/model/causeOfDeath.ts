import { reference } from "astro:content";
import { z } from "astro/zod";

import { zInternetResourceReference } from "./internetResource";
import { zPortableText } from "./portableText";

const causeCategories = ["illness", "traumatic"] as const;
export const zCauseCategory = z.enum(causeCategories);
export type CauseCategory = z.infer<typeof zCauseCategory>;

export const zCauseOfDeath = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  displayTitle: z.string().nullable(),
  shortDescription: z.string(),
  description: zPortableText.nullable(),
  causeCategory: z.array(zCauseCategory).nullable(),
  coverImage: reference("imageAssets").nullable(),
  searchAliases: z.array(z.string()).nullable(),
  aiPromptHint: z.string().nullable(),
  featuredResources: z.array(zInternetResourceReference),
  secondaryFeaturedResources: z.array(zInternetResourceReference),
});
