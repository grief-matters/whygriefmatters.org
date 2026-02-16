import { z } from "astro:content";
import { zImage } from "./image";

export default z.object({
  id: z.string(),
  title: z.string(),
  images: z.array(zImage),
});
