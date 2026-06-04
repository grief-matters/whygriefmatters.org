import { z } from "astro/zod";

import { zInternetResourceReference } from "../internetResource";

export default z.object({
  contentType: z.literal("featuredResources"),
  resources: z.array(zInternetResourceReference),
});
