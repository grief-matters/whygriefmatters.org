import { z } from "zod";
import { zImage } from "./image";
import { zPortableText } from "./portableText";
import {
  zRowOfThree,
  zRowOfThreeFeaturedResources,
  zResourcePageLinks,
  zResourceLinks,
  zPortableTextContentBlock,
  zDynamicResourcePageLink,
} from "./contentBlock";

const topicCollectionDisplayOptions = ["none", "topThree", "all"] as const;
const zTopicCollectionDisplayOption = z.enum(topicCollectionDisplayOptions);

const zTopic = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  image: zImage.nullable(),
});

export const zTopicCollectionContentBlock = z.object({
  showDescription: z.boolean(),
  showDescriptions: zTopicCollectionDisplayOption,
  showImages: zTopicCollectionDisplayOption,
  topicCollection: z.object({
    description: z.string().nullable(),
    topics: z.array(zTopic),
  }),
});

export const zFeaturedContentContent = z.discriminatedUnion("contentType", [
  zRowOfThree.extend({ contentType: z.literal("rowOfThree") }),
  zRowOfThreeFeaturedResources.extend({
    contentType: z.literal("rowOfThreeFeaturedResources"),
  }),
  zPortableTextContentBlock.extend({
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
  featuredContentFooterLink: zDynamicResourcePageLink.nullable(),
});

export type FeaturedContentContent = z.infer<typeof zFeaturedContentContent>;
export type FeaturedContent = z.infer<typeof zFeaturedContent>;
export type ResourceLinks = z.infer<typeof zResourceLinks>;
export type ResourcePageLinks = z.infer<typeof zResourcePageLinks>;
export type RowOfThree = z.infer<typeof zRowOfThree>;
export type TopicCollectionDisplayOption = z.infer<
  typeof zTopicCollectionDisplayOption
>;
export type TopicCollectionContentBlock = z.infer<
  typeof zTopicCollectionContentBlock
>;
export type Topic = z.infer<typeof zTopic>;
