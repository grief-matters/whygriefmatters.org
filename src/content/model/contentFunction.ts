import { z } from "astro/zod";

export const zContentFunction = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  displayTitle: z.string().nullable(),
  description: z.string(),
  searchAliases: z.array(z.string()).nullable(),
});
