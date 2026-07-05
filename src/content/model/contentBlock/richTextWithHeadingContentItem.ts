import { z } from "astro/zod";

import { zNonEmptyString } from "../utils";
import { zPortableText } from "../portableText";
import { zHeadingLevel } from "../shared/headingLevel";

export const zRichTextWithHeadingContentItem = z.object({
  contentType: z.literal("richTextWithHeading"),
  headingText: zNonEmptyString,
  headingLevel: zHeadingLevel,
  portableText: zPortableText,
});
