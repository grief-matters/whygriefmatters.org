import { z } from "astro/zod";

import { zInternetResourceReference } from "../internetResource";

export const zFeaturedResourceContentItem = z.object({
  contentType: z.literal("featuredResource"),
  ...zInternetResourceReference.shape,
});
