import { z } from "zod";
import { zPerson } from "./person";

export const zPersonGroup = z.object({
  name: z.string(),
  description: z.string().nullable(),
  members: z.array(zPerson),
});

export type PersonGroup = z.infer<typeof zPersonGroup>;
