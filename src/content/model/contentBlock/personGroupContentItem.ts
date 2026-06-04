import { reference } from "astro:content";
import { z } from "astro/zod";

export const zPersonGroupContentItem = z.object({
  contentType: z.literal("personGroup"),
  refId: reference("personGroups"),
});
