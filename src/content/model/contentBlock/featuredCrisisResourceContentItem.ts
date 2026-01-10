import { z } from "astro:content";
import { zContentType } from "./contentType";

// todo
export default z.object({
  contentType: z.literal(zContentType.Enum.featuredCrisisResource),
});
