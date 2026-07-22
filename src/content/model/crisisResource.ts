import { z } from "astro/zod";

import { zSanityImage } from "./image";
import { zBasicInternetResource } from "./internetResource";
import { zContactMethod } from "./shared/contactMethod";

export const zCrisisResource = z.object({
  ...zBasicInternetResource.shape,
  resourceUrl: z.url().nullable(),
  contactMethods: z.array(zContactMethod).nullable(),
  logo: zSanityImage.nullable(),
});

export type CrisisResource = z.infer<typeof zCrisisResource>;
