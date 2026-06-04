import { reference, z } from "astro:content";

export default z.object({
  contentType: z.literal("person"),
  refId: reference("people"),
});
