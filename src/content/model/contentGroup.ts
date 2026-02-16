import { z, reference } from "astro:content";

import { zImage } from "./image";

export default z.object({
  id: z.string(),
  slug: z.string().nullable(),
  title: z.string().nullable(),
  image: zImage.nullish(),
  contentBlocks: z.array(reference("contentBlocks")),
});
