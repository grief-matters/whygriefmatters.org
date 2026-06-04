import { reference } from "astro:content";
import { z } from "astro/zod";

export default z.object({
  contentType: z.literal("imageAsset"),
  refId: reference("imageAssets"),
});
