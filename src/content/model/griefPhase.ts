import { z } from "astro/zod";

export const zGriefPhase = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  searchAliases: z.array(z.string()).nullable(),
});
