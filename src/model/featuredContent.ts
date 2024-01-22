import { z } from "zod";
import {
  zPortableText,
  zResourceLinks,
  zResourcePageLink,
  zResourcePageLinks,
  zRichTextContentBlock,
  zRowOfThree,
} from "./common";

export const zFeaturedContentContent = z.discriminatedUnion("contentType", [
  zRowOfThree.extend({ contentType: z.literal("rowOfThree") }),
  zRichTextContentBlock.extend({
    contentType: z.literal("richTextContentBlock"),
  }),
  zResourcePageLinks.extend({ contentType: z.literal("resourcePageLinks") }),
  zResourceLinks.extend({ contentType: z.literal("resourceLinks") }),
]);

export type FeaturedContentContent = z.infer<typeof zFeaturedContentContent>;

export const zFeaturedContent = z.object({
  title: z.string(),
  description: zPortableText.optional(),
  content: z.array(zFeaturedContentContent),
  featuredContentFooterLink: zResourcePageLink.optional(),
});
