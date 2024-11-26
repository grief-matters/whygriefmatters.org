import { z } from "zod";
import groq from "groq";

import {
  gFeaturedResourceProjection,
  zFeaturedResource,
} from "./featuredResource";
import { zImage } from "./image";
import { zInternetResourceType } from "./internetResource";
import { zPortableText } from "./portableText";
import {
  gBaseTopicProjection,
  getRecursiveSubtopicsProjection,
  zTopic,
} from "./topic";

export const zRichTextContentBlock = z.object({
  portableText: zPortableText,
});

export const zResourceLink = z.object({
  title: z.string(),
  url: z.string().url(),
  type: zInternetResourceType.nullable(),
});

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

export const zTopicContentBlock = z.object({
  topic: zTopic,
  displayTitle: z.string().nullable(),
  showImage: z.boolean(),
  showDescription: z.boolean(),
  showSubtopics: z.boolean(),
});

// TODO - break this up - it's very difficult to debug
export const gContentBlocksProjection = groq`
  _type == "accessibleImage" => {
    "contentType": _type,
    image,
    "altText": alt
  },
  _type == "resourceLinks" => {
    "contentType": _type,
    resources[]->{
      "title": coalesce(title, name),
      "url": resourceUrl,
      "type": _type
    }
  },
  _type == "resourcePageLinks" => {
    "contentType": _type,
    links[]{
      label,
      type,
      "category": category -> slug.current,
      "population": population -> slug.current
    },
  },
  _type == "richTextContentBlock" => {
    "contentType": _type,
    portableText
  },
  _type == "rowOfThree" => {
    "contentType": _type,
    images[]{
      image,
      "altText": alt
    }
  },
  _type == "rowOfThreeFeaturedResources" => {
    "contentType": _type,
    resources[]->{
      ${gFeaturedResourceProjection}
    }
  },
  _type == "topicContentBlock" => {
    "contentType": _type,
    topic->{
      ${gBaseTopicProjection}
      "subtopics": select(^.showSubtopics == true => subtopics[]->{
        ${getRecursiveSubtopicsProjection()}
      }, null),
    },
    "displayTitle": titleOverride,
    showImage,
    showDescription,
    showSubtopics
  },
  _type == "topicCollectionContentBlockNew" => {
    "contentType": _type,
    "topics": topicContentBlocks[]{
      topic->{
        ${gBaseTopicProjection}
        "subtopics": select(^.showSubtopics == true => subtopics[]->{
          ${getRecursiveSubtopicsProjection()}
        }, null),
      },
      "displayTitle": titleOverride,
      showImage,
      showDescription,
      showSubtopics
    },
  },
`;

export const zTopicCollectionContentBlock = z.object({
  topics: z.array(zTopicContentBlock),
});

export const zContentBlock = z.discriminatedUnion("contentType", [
  zImage.extend({ contentType: z.literal("accessibleImage") }),
  zResourceLinks.extend({ contentType: z.literal("resourceLinks") }),
  zResourcePageLinks.extend({ contentType: z.literal("resourcePageLinks") }),
  zRichTextContentBlock.extend({
    contentType: z.literal("richTextContentBlock"),
  }),
  zRowOfThree.extend({ contentType: z.literal("rowOfThree") }),
  zRowOfThreeFeaturedResources.extend({
    contentType: z.literal("rowOfThreeFeaturedResources"),
  }),
  zTopicContentBlock.extend({ contentType: z.literal("topicContentBlock") }),
  zTopicCollectionContentBlock.extend({
    contentType: z.literal("topicCollectionContentBlockNew"),
  }),
]);

export type ContentBlock = z.infer<typeof zContentBlock>;
export type RichTextContentBlock = z.infer<typeof zRichTextContentBlock>;
export type TopicContentBlock = z.infer<typeof zTopicContentBlock>;
export type TopCollectionContentBlock = z.infer<
  typeof zTopicCollectionContentBlock
>;
