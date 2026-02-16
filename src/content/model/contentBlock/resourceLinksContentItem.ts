import { z } from "astro:content";

import { zInternetResourceType } from "../internetResource";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.resourceLinks),
  resources: z.array(
    z.object({
      title: z.string(),
      type: zInternetResourceType,
      url: z.string().url(),
    }),
  ),
});
