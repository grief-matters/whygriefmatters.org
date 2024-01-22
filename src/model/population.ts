import groq from "groq";
import { z } from "zod";

export const zPopulation = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  underserved: z.boolean(),
});

export type Population = z.infer<typeof zPopulation>;

export const populationQuery = groq`
*[_type == "population" && slug.current == $population][0]{
  name,
  "slug": slug.current,
  description,
  underserved
}
`;
