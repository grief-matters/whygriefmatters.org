import { z } from "astro/zod";
import { zNonEmptyString } from "../utils";
import { zHeadingLevel } from "../shared/headingLevel";

export const zHeadingTextContentItem = z.object({
  contentType: z.literal("headingText"),
  text: zNonEmptyString,
  headingLevel: zHeadingLevel,
});
