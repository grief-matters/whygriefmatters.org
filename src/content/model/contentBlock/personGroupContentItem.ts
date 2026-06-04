import { reference, z } from "astro:content";

export default z.object({
  contentType: z.literal("personGroup"),
  refId: reference("personGroups"),
});
