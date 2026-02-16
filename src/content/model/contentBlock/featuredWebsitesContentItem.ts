import { reference, z } from "astro:content";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.featuredWebsites),
  websites: z.array(reference("websites")),
});
