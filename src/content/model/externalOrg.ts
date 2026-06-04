import type { z } from "astro/zod";
import { zSanityImage } from "./image";
import { zBasicInternetResource } from "./internetResource";

/**
 * External Org omits the `sourceOrg` reference (it IS a source org) and
 * adds an optional inline logo image.
 */
export const zExternalOrg = zBasicInternetResource
  .omit({ sourceOrgId: true })
  .extend({
    logo: zSanityImage.nullable(),
  });

export type ExternalOrg = z.infer<typeof zExternalOrg>;
