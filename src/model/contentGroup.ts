import { z } from "zod";
import groq from "groq";

import { gContentBlocksProjection, zContentBlock } from "./contentBlock";
import { zPortableText } from "./portableText";
import { zInternetResourceType } from "./internetResource";

export const gContentGroupProjection = groq`
    title,
    description,
    "blocks": contentBlocks[]{
      "content": content[]{
        ${gContentBlocksProjection}
      }
    }.content,
    "jumpLink": coalesce(contentGroupJumpLink{
        "jumpLinkType": _type,
        label, 
        type,
        "population": population->slug.current,
        "category": category->slug.current
      }, relativeContentGroupJumpLink{
        "jumpLinkType": "relative",
        label, 
        url
      }
    )
`;

export const zContentGroup = z.object({
  title: z.string().nullable(),
  description: zPortableText.nullable(),
  blocks: z.array(z.array(zContentBlock)),
  jumpLink: z
    .discriminatedUnion("jumpLinkType", [
      // TODO: We can't use the zResourcePageLink schema as extend/refine don't mix
      z
        .object({
          label: z.string(),
          type: zInternetResourceType.nullable(),
          population: z.string().nullable(),
          category: z.string().nullable(),
        })
        .extend({ jumpLinkType: z.literal("resourcePageLink") }),
      z.object({
        label: z.string(),
        url: z.string(),
        jumpLinkType: z.literal("relative"),
      }),
    ])
    .nullable(),
});

export type ContentGroup = z.infer<typeof zContentGroup>;
