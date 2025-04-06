import { z } from "zod";

export const zContactInput = z.object({
  // Honeypot field
  referralSource: z.string().nullable(),
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(2),
});

export type ContactInput = z.infer<typeof zContactInput>;
