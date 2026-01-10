import { z } from "astro:content";

import { zNonEmptyString } from "../utils";
import { zPortableText } from "../portableText";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.richTextWithHeading),
  headingText: zNonEmptyString,
  portableText: zPortableText,
});
