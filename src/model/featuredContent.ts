import { z } from "zod";
import { zImage } from "./image";
import { zInternetResourceType } from "./internetResource";
import { zRichTextContentBlock, zPortableText } from "./portableText";
import { zFeaturedResource } from "./featuredResource";

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
  type: zInternetResourceType.nullable(),
});

export const zRowOfThree = z.object({
  images: z.array(zImage),
});

export const zRowOfThreeFeaturedResources = z.object({
  resources: z.array(zFeaturedResource),
});

export const zResourcePageLinks = z.object({
  links: z.array(zResourcePageLink),
});

export const zResourceLinks = z.object({
  resources: z.array(zResourceLink),
});

const topicCollectionDisplayOptions = ["none", "topThree", "all"] as const;
const zTopicCollectionDisplayOption = z.enum(topicCollectionDisplayOptions);

export const zTopicCollectionContentBlock = z.object({
  showDescription: z.boolean(),
  showDescriptions: zTopicCollectionDisplayOption,
  showImages: zTopicCollectionDisplayOption,
  topicCollection: z.object({
    description: z.string().nullable(),
    topics: z.array(
      z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable(),
        image: zImage.nullable(),
      }),
    ),
  }),
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
  zTopicCollectionContentBlock.extend({
    contentType: z.literal("topicCollectionContentBlock"),
  }),
]);

export const zFeaturedContent = z.object({
  title: z.string(),
  description: zPortableText.nullable(),
  content: z.array(zFeaturedContentContent),
  featuredContentFooterLink: zResourcePageLink.nullable(),
});

export type FeaturedContentContent = z.infer<typeof zFeaturedContentContent>;
export type FeaturedContent = z.infer<typeof zFeaturedContent>;
export type ResourceLinks = z.infer<typeof zResourceLinks>;
export type ResourcePageLinks = z.infer<typeof zResourcePageLinks>;
export type RowOfThree = z.infer<typeof zRowOfThree>;
