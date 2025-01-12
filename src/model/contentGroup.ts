import { z } from "zod";
import groq from "groq";

import { gContentBlocksProjection, zContentBlock } from "./contentBlock";
import { zPortableText } from "./portableText";
import { zExtendedResourceType } from "./internetResource";

export const gContentGroupProjection = groq`
  title,
  description,
  "blocks": coalesce(contentBlocks[]->{
    title,
    description,
    "content": content[]{
      ${gContentBlocksProjection}
    }
  }, []),
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
  ),
  "slug": slug.current
`;

export const gContentGroupPagesQuery = groq`
  *[_type == "contentGroup" && defined(slug.current)]{
    ${gContentGroupProjection}
  }
`;

export const zContentGroup = z.object({
  title: z.string().nullable(),
  slug: z.string().nullable(),
  description: zPortableText.nullable(),
  blocks: z.array(zContentBlock),
  jumpLink: z
    .discriminatedUnion("jumpLinkType", [
      // TODO: We can't use the zResourcePageLink schema as extend/refine don't mix
      z
        .object({
          label: z.string(),
          type: zExtendedResourceType.nullable(),
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
