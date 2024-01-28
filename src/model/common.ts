import { z } from "zod";
import type { TypedObject } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const INTERNET_RESOURCE_TYPES = [
  "app",
  "article",
  "blog",
  "book",
  "booklet",
  "brochure",
  "course",
  "forum",
  "memorial",
  "peerSupport",
  "podcast",
  "podcastEpisode",
  "story",
  "supportGroup",
  "therapyResource",
  "video",
  "webinar",
  "website",
] as const;

export const zInternetResourceType = z.enum(INTERNET_RESOURCE_TYPES);

export type InternetResourceType = z.infer<typeof zInternetResourceType>;

/**
 * Helper to create a Zod schema for a pre-defined type
 * @returns
 */
const schemaForType =
  <T>() =>
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

const zBaseTypedObject = z
  .object({
    _type: z.string(),
    _key: z.string(),
  })
  .passthrough();

export const zTypedObject = schemaForType<TypedObject>()(zBaseTypedObject);

export const zPortableText = z.array(zTypedObject);

export type PortableText = z.infer<typeof zPortableText>;

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
  schemaForType<SanityImageSource>()(zBaseSanityImage);

export const zResourcePageLink = z
  .object({
    label: z.string(),
    type: zInternetResourceType.nullable(),
    population: z.string().nullable(),
    category: z.string().nullable(),
  })
  .refine(
    (val) =>
      val.type !== null || val.population !== null || val.category !== null,
  );

export type ResourcePageLink = z.infer<typeof zResourcePageLink>;

export const zImage = z.object({
  image: zSanityImage,
  altText: z.string(),
});

export const zRowOfThree = z.object({
  images: z.array(zImage),
});

export type RowOfThree = z.infer<typeof zRowOfThree>;

export const zRichTextContentBlock = z.object({
  portableText: zPortableText,
});

export type RichTextContentBlock = z.infer<typeof zRichTextContentBlock>;

export const zResourcePageLinks = z.object({
  links: z.array(zResourcePageLink),
});

export type ResourcePageLinks = z.infer<typeof zResourcePageLinks>;

export const zResourceLink = z.object({
  title: z.string(),
  url: z.string().url(),
});

export const zResourceLinks = z.object({
  resources: z.array(zResourceLink),
});

export type ResourceLinks = z.infer<typeof zResourceLinks>;
