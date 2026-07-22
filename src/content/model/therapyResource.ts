import { z } from "astro/zod";

import { zBasicInternetResource } from "./internetResource";
import { zSupportFormat } from "./peerSupport";

export const zTherapyResource = zBasicInternetResource.extend({
  format: z.array(zSupportFormat).nullable(),
  budgetFriendly: z.boolean(),
});

export type TherapyResource = z.infer<typeof zTherapyResource>;
