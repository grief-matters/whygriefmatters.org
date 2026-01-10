import { z } from "astro:content";

import { zImage } from "../image";
import { zContentType } from "./contentType";

export default zImage.extend({
  contentType: z.literal(zContentType.Enum.accessibleImage),
});
