import { reference } from "astro:content";
import { z } from "astro/zod";

export default z.object({
  id: z.string(),
  slug: z.string().nullable(),
  name: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  imageAssetId: reference("imageAssets").nullable(),
  contentBlocks: z.array(reference("contentBlocks")),
});
