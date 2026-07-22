import { z } from "astro/zod";

import { zBasicInternetResource } from "./internetResource";
import { zSupportFormat } from "./peerSupport";

export const zSupportGroup = zBasicInternetResource.extend({
  format: z.array(zSupportFormat).nullable(),
});

export type SupportGroup = z.infer<typeof zSupportGroup>;
