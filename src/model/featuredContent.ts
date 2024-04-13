import { z } from "zod";
import { zImage } from "./image";
import { zInternetResourceType } from "./internetResource";
import { zRichTextContentBlock, zPortableText } from "./portableText";

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

export const zResourceLink = z.object({
  title: z.string(),
  url: z.string().url(),
});

export const zRowOfThree = z.object({
  images: z.array(zImage),
});

export const zRowOfThreeFeaturedResources = z.object({
  resources: z.array(
    zResourceLink.extend({
      image: zImage.nullable(),
    }),
  ),
});

export const zResourcePageLinks = z.object({
  links: z.array(zResourcePageLink),
});

export const zResourceLinks = z.object({
  resources: z.array(zResourceLink),
});

export const zFeaturedContentContent = z.discriminatedUnion("contentType", [
  zRowOfThree.extend({ contentType: z.literal("rowOfThree") }),
  zRowOfThreeFeaturedResources.extend({
    contentType: z.literal("rowOfThreeFeaturedResources"),
  }),
  zRichTextContentBlock.extend({
    contentType: z.literal("richTextContentBlock"),
  }),
  zResourcePageLinks.extend({ contentType: z.literal("resourcePageLinks") }),
  zResourceLinks.extend({ contentType: z.literal("resourceLinks") }),
]);

export const zFeaturedContent = z.object({
  title: z.string(),
  description: zPortableText.optional(),
  content: z.array(zFeaturedContentContent),
  featuredContentFooterLink: zResourcePageLink.optional(),
});

export type FeaturedContentContent = z.infer<typeof zFeaturedContentContent>;
export type FeaturedContent = z.infer<typeof zFeaturedContent>;
export type ResourceLinks = z.infer<typeof zResourceLinks>;
export type ResourcePageLinks = z.infer<typeof zResourcePageLinks>;
export type RowOfThree = z.infer<typeof zRowOfThree>;
