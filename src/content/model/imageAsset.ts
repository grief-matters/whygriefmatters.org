import { z } from "astro/zod";

import { zSanityImage } from "./image";

export const zImageAsset = z.object({
  id: z.string(),
  image: zSanityImage,
  alt: z.string(),
});

export type ImageAsset = z.infer<typeof zImageAsset>;
