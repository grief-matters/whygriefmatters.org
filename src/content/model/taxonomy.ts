import { z } from "astro/zod";

const taxonomyRefTypes = [
  "lossRelationship",
  "causeOfDeath",
  "theme",
  "demographic",
  "griefPhase",
  "griefType",
  "emotionalState",
  "contentFunction",
] as const;
export const zTaxonomyRefType = z.enum(taxonomyRefTypes);
export type TaxonomyRefType = z.infer<typeof zTaxonomyRefType>;

export const zTaxonomyReference = z.object({
  refType: zTaxonomyRefType,
  refId: z.string(),
});
export type TaxonomyReference = z.infer<typeof zTaxonomyReference>;
