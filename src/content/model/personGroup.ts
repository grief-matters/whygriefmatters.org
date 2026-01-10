import { reference, z } from "astro:content";
import { zNonEmptyString } from "./utils";

export default z.object({
  name: zNonEmptyString,
  description: z.string().nullable(),
  members: z.array(reference("people")),
});
