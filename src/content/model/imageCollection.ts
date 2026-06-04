import { reference, z } from "astro:content";

export default z.object({
  id: z.string(),
  title: z.string(),
  images: z.array(reference("imageAssets")),
});
