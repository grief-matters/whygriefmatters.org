import { z } from "zod";

import groq from "groq";
import {
  zInternetResourcePageListing,
  gPageResourceListingProjection,
} from "./internetResource";
import { zCategory } from "./category";

export const zPopulationPageData = z.object({
  name: z.string(),
  slug: z.string(),
  resources: z
    .array(
      zInternetResourcePageListing.extend({
        categories: z.array(zCategory).nullable(),
      }),
    )
    .nullable(),
});

export const gPopulationsPageData = groq`
*[_type == "population"]{
  name,
  "slug": slug.current,
  "resources": *[^.slug.current in populations[]->slug.current]{
    categories[]->{
      title,
      "slug": slug.current
    },
    ${gPageResourceListingProjection}
  }
}
`;

export type PopulationsPageData = z.infer<typeof zPopulationPageData>;
