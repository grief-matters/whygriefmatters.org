import { z } from "astro:content";

import { zInternetResourceReference } from "../internetResource";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.featuredResources),
  resources: z.array(zInternetResourceReference),
});
