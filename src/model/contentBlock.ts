import { z } from "zod";
import groq from "groq";

import {
  gFeaturedResourceProjection,
  zFeaturedResource,
} from "./featuredResource";
import { zImage } from "./image";
import { zExtendedResourceType } from "./internetResource";
import { zPortableText } from "./portableText";
import {
  gBaseTopicProjection,
  getRecursiveSubtopicsProjection,
  zTopic,
} from "./topic";
import { gCrisisResourceProjection, zCrisisResource } from "./crisisResource";
import { gPersonProjection, zPerson } from "./person";
import { zPersonGroup } from "./personGroup";

export const zPortableTextContentBlock = z.object({
  portableText: zPortableText,
});

export const zResourceLink = z.object({
  title: z.string(),
  url: z.string().url(),
  type: zExtendedResourceType.nullable(),
});

export const zDynamicResourcePageLink = z.object({
  label: z.string(),
  type: zExtendedResourceType.nullable(),
  population: z.string().nullable(),
  category: z.string().nullable(),
});

export const zRelativePageLink = z.object({
  label: z.string(),
  url: z.string(),
});

export const zResourcePageLink = z.discriminatedUnion("linkType", [
  zRelativePageLink.extend({ linkType: z.literal("relativeLink") }),
  zDynamicResourcePageLink.extend({ linkType: z.literal("resourcePageLink") }),
]);

export type DynamicResourcePageLink = z.infer<typeof zDynamicResourcePageLink>;
export type ResourcePageLink = z.infer<typeof zResourcePageLink>;

export const zRowOfThree = z.object({
  images: z.array(zImage),
});

export const zRowOfThreeFeaturedResources = z.object({
  resources: z.array(zFeaturedResource),
});

export const zFeaturedResourceBlock = z.object({
  resource: zFeaturedResource,
});

export const zFeaturedCrisisResourceBlock = z.object({
  showImage: z.boolean().nullable(),
  resource: zCrisisResource,
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
      _type == "relativeLink" => {
        "linkType": _type,
        label,
        url
      },
      _type == "resourcePageLink" => {
        "linkType": _type,
        label,
        type,
        "category": category -> slug.current,
        "population": population -> slug.current
      },
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
  _type == "featuredResource" => {
    "contentType": _type,
    resource->{
      ${gFeaturedResourceProjection}
    }
  },
  _type == "featuredCrisisResource" => {
    "contentType": _type,
    showImage,
    resource->{
      ${gCrisisResourceProjection}
    }
  },
  _type == "relativeLink" => {
    "contentType": _type,
    label,
    url
  },
  _type == "reference" => @->{
    _type == "person" => {
      "contentType": _type,
      ${gPersonProjection}
    },
    _type == "personGroup" => {
      "contentType": _type,
      name,
      members[]->{
        ${gPersonProjection}
      }
    }
  },
`;

export const zTopicCollectionContentBlock = z.object({
  topics: z.array(zTopicContentBlock),
});

export const zContent = z.discriminatedUnion("contentType", [
  zImage.extend({ contentType: z.literal("accessibleImage") }),
  zResourceLinks.extend({ contentType: z.literal("resourceLinks") }),
  zResourcePageLinks.extend({ contentType: z.literal("resourcePageLinks") }),
  zPortableTextContentBlock.extend({
    contentType: z.literal("richTextContentBlock"),
  }),
  zRowOfThree.extend({ contentType: z.literal("rowOfThree") }),
  zRowOfThreeFeaturedResources.extend({
    contentType: z.literal("rowOfThreeFeaturedResources"),
  }),
  zFeaturedResourceBlock.extend({ contentType: z.literal("featuredResource") }),
  zFeaturedCrisisResourceBlock.extend({
    contentType: z.literal("featuredCrisisResource"),
  }),
  zTopicContentBlock.extend({ contentType: z.literal("topicContentBlock") }),
  zTopicCollectionContentBlock.extend({
    contentType: z.literal("topicCollectionContentBlockNew"),
  }),
  zRelativePageLink.extend({ contentType: z.literal("relativeLink") }),
  zPerson.extend({ contentType: z.literal("person") }),
  zPersonGroup.extend({ contentType: z.literal("personGroup") }),
]);

export const zContentBlock = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  content: z.array(zContent),
});

export type Content = z.infer<typeof zContent>;
export type ContentBlock = z.infer<typeof zContentBlock>;
export type PortableTextContentBlock = z.infer<
  typeof zPortableTextContentBlock
>;
export type TopicContentBlock = z.infer<typeof zTopicContentBlock>;
export type TopCollectionContentBlock = z.infer<
  typeof zTopicCollectionContentBlock
>;
