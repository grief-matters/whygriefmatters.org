import { reference } from "astro:content";
import { z } from "astro/zod";

export const zEndorsement = z.object({
  id: z.string(),
  endorsement: z.string(),
  excerpt: z.string(),
  endorser: reference("people"),
});
