import groq from "groq";
import { z } from "zod";

import { zImage } from "./image";

export const gBaseTopicProjection = groq`
  "title": coalesce(title, name),
  "slug": slug.current,
  description,
  image{
    image,
    "altText": alt
  },
`;

export function getRecursiveSubtopicsProjection(depth: number = 5): string {
  return groq`
    ${gBaseTopicProjection}
    ${
      depth > 0
        ? `"subtopics" : subtopics[]->{
          ${getRecursiveSubtopicsProjection(depth - 1)}
    }`
        : ``
    }
  `;
}

export const zBaseTopic = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  image: zImage.nullish(),
});

export const zTopic: z.ZodType<Topic> = zBaseTopic.extend({
  subtopics: z.lazy(() => zTopic.array().nullish()),
});

export type Topic = z.infer<typeof zBaseTopic> & {
  subtopics?: Array<Topic> | null;
};
