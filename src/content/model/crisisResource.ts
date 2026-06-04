import { z } from "astro/zod";

import { zSanityImage } from "./image";
import { zBasicInternetResource } from "./internetResource";
import { zContactMethod } from "./shared/contactMethod";

export const zCrisisResource = zBasicInternetResource.extend({
  contactMethods: z.array(zContactMethod).nullable(),
  logo: zSanityImage.nullable(),
});

export type CrisisResource = z.infer<typeof zCrisisResource>;
