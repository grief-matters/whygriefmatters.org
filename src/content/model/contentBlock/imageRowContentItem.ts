import { z } from "astro:content";

import { zImage } from "../image";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.imageRow),
  images: z.array(zImage),
});
