import { reference } from "astro:content";
import { z } from "astro/zod";

export const zImageRowContentItem = z.object({
  contentType: z.literal("imageRow"),
  images: z.array(reference("imageAssets")),
});
