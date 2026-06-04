import { reference } from "astro:content";
import { z } from "astro/zod";

const zWdynrnDestination = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("causeOfDeath"),
    ref: reference("causesOfDeath"),
  }),
  z.object({
    kind: z.literal("lossRelationship"),
    ref: reference("lossRelationships"),
  }),
  z.object({
    kind: z.literal("url"),
    url: z.string(),
  }),
]);

export type WdynrnDestination = z.infer<typeof zWdynrnDestination>;

export const zWdynrnEntry = z.object({
  id: z.string(),
  entryText: z.string(),
  destination: zWdynrnDestination.nullable(),
});
