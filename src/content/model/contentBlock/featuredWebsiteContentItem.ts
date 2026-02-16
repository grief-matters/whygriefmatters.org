import { z, reference } from "astro:content";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.featuredWebsite),
  refId: reference("websites"),
});
