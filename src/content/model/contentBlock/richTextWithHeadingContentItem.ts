import { z } from "astro/zod";

import { zNonEmptyString } from "../utils";
import { zPortableText } from "../portableText";

export const zRichTextWithHeadingContentItem = z.object({
  contentType: z.literal("richTextWithHeading"),
  headingText: zNonEmptyString,
  portableText: zPortableText,
});
