import { reference } from "astro:content";
import { z } from "astro/zod";

export default z.object({
  id: z.string(),
  title: z.string(),
  images: z.array(reference("imageAssets")),
});
