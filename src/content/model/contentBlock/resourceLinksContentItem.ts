import { z } from "astro/zod";

import { zInternetResourceType } from "../internetResource";

export default z.object({
  contentType: z.literal("resourceLinks"),
  resources: z.array(
    z.object({
      title: z.string(),
      type: zInternetResourceType,
      url: z.string().url(),
    }),
  ),
});
