import { z } from "zod";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { zSchemaForType } from "./helpers";

const zBaseSanityImage = z
  .object({
    _type: z.literal("image"),
    asset: z.object({
      _ref: z.string(),
      _type: z.literal("reference"),
    }),
  })
  .passthrough();

export const zSanityImage =
  zSchemaForType<SanityImageSource>()(zBaseSanityImage);

export const zImage = z.object({
  image: zSanityImage,
  altText: z.string(),
});

export type SanityImage = z.infer<typeof zImage>;
