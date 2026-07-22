import { z } from "astro/zod";

import { zBasicInternetResource } from "./internetResource";

export const zSupportFormat = z.enum(["in-person", "remote"]);
export type SupportFormat = z.infer<typeof zSupportFormat>;

export const zPeerSupport = zBasicInternetResource.extend({
  format: z.array(zSupportFormat).nullable(),
});

export type PeerSupport = z.infer<typeof zPeerSupport>;
