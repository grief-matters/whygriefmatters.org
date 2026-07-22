import { reference } from "astro:content";
import { z } from "astro/zod";

export const zDemographic = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  underserved: z.boolean(),
  imageAsset: reference("imageAssets").nullable(),
  searchAliases: z.array(z.string()).nullable(),
});
