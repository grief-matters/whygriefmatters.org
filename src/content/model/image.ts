import { z } from "astro:content";

import { zSchemaForType } from "./utils";
import type { SanityImageSource } from "@sanity/image-url";

const zBaseSanityImage = z
  .object({
    crop: z
      .object({
        top: z.number(),
        right: z.number(),
        bottom: z.number(),
        left: z.number(),
        _type: z.literal("sanity.imageCrop"),
      })
      .nullish(),
    hotspot: z
      .object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        _type: z.literal("sanity.imageHotspot"),
      })
      .nullish(),
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
