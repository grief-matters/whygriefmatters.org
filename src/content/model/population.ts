import { z } from "astro:content";

import { zImage } from "./image";

const populationSlugs = [
  "latino-and-hispanic-americans",
  "african-american-black",
  "asian-american-and-pacific-islander",
  "people-with-disabilities",
  "lgbtq-community",
  "indigenous-communities",
] as const;
const zPopulationSlug = z.enum(populationSlugs);
export type PopulationSlug = z.infer<typeof zPopulationSlug>;

export const zPopulation = z.object({
  name: z.string(),
  slug: zPopulationSlug,
  description: z.string().nullable(),
  underserved: z.boolean(),
  image: zImage.nullable(),
});
