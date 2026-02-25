import { reference, z } from "astro:content";

export const zEndorsement = z.object({
  id: z.string(),
  endorsement: z.string(),
  excerpt: z.string(),
  endorser: reference("people"),
});
