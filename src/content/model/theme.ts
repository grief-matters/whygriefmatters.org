import { reference } from "astro:content";
import { z } from "astro/zod";

import { zInternetResourceReference } from "./internetResource";
import { zPortableText } from "./portableText";

export const zTheme = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  displayTitle: z.string().nullable(),
  shortDescription: z.string(),
  description: zPortableText.nullable(),
  coverImage: reference("imageAssets").nullable(),
  searchAliases: z.array(z.string()).nullable(),
  aiPromptHint: z.string().nullable(),
  featuredResources: z.array(zInternetResourceReference),
  secondaryFeaturedResources: z.array(zInternetResourceReference),
});
