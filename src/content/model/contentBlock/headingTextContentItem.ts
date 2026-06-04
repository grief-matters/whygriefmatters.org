import { z } from "astro/zod";
import { zNonEmptyString } from "../utils";

export const zHeadingTextContentItem = z.object({
  contentType: z.literal("headingText"),
  text: zNonEmptyString,
});
