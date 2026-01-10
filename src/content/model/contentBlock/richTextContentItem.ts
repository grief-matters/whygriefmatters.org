import { z } from "astro:content";

import { zPortableText } from "../portableText";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.richTextContentBlock),
  portableText: zPortableText,
  emphasized: z.boolean(),
});
