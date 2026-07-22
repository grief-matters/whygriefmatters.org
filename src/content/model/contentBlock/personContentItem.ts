import { reference } from "astro:content";
import { z } from "astro/zod";

export const zPersonContentItem = z.object({
  contentType: z.literal("person"),
  refId: reference("people"),
});
