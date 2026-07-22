import { reference } from "astro:content";
import { z } from "astro/zod";
import { zNonEmptyString } from "./utils";

export default z.object({
  name: zNonEmptyString,
  description: z.string().nullable(),
  members: z.array(reference("people")),
});
