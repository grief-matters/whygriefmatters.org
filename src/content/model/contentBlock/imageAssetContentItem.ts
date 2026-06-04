import { reference } from "astro:content";
import { z } from "astro/zod";

export const zImageAssetContentItem = z.object({
  contentType: z.literal("imageAsset"),
  refId: reference("imageAssets"),
});
