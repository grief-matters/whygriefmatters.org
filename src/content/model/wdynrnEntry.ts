import { z } from "astro:content";

export const zWdynrnEntry = z.object({
  id: z.string(),
  entryText: z.string(),
  pageSlug: z.string(),
});
