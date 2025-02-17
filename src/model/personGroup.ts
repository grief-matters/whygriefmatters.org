import { z } from "zod";
import { zPerson } from "./person";

export const zPersonGroup = z.object({
  name: z.string(),
  members: z.array(zPerson),
});
