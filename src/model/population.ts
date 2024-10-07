import groq from "groq";
import { z } from "zod";

export const zPopulation = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  underserved: z.boolean(),
});

export type Population = z.infer<typeof zPopulation>;

export const gPopulationQuery = groq`
*[_type == "population" && slug.current == $population][0]{
  name,
  "slug": slug.current,
  description,
  underserved
}
`;

export const gPopulationsQuery = groq`
*[_type == "population"]{
  name,
  "slug": slug.current,
  description,
  underserved
}
`;
