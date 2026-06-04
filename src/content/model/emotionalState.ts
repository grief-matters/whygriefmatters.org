import { z } from "astro/zod";

export const zEmotionalState = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  searchAliases: z.array(z.string()).nullable(),
  aiPromptHint: z.string().nullable(),
});
