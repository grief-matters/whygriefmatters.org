import { z, reference } from "astro:content";

export const zDemographic = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  underserved: z.boolean(),
  imageAsset: reference("imageAssets").nullable(),
  searchAliases: z.array(z.string()).nullable(),
  aiPromptHint: z.string().nullable(),
});
