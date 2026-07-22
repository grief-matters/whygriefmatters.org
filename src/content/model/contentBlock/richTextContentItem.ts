import { z } from "astro/zod";

import { zPortableText } from "../portableText";

export const zRichTextContentItem = z.object({
  contentType: z.literal("richTextContentBlock"),
  portableText: zPortableText,
  emphasized: z.boolean(),
});
