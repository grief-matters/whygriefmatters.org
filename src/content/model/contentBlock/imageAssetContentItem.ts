import { reference, z } from "astro:content";

export default z.object({
  contentType: z.literal("imageAsset"),
  refId: reference("imageAssets"),
});
