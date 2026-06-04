import { reference, z } from "astro:content";

export default z.object({
  contentType: z.literal("imageRow"),
  images: z.array(reference("imageAssets")),
});
