import { z } from "zod";

import groq from "groq";
import {
  zInternetResourcePageListing,
  gPageResourceListingProjection,
} from "./internetResource";
import { zCategory } from "./category";
import { zImage } from "./image";

export const zPopulationPageData = z.object({
  name: z.string(),
  slug: z.string(),
  image: zImage.nullish(),
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
  image{
    image,
    "altText": alt
  },
  "resources": *[^.slug.current in populations[]->slug.current && _type != 'crisisResource']{
    categories[]->{
      title,
      "slug": slug.current
    },
    ${gPageResourceListingProjection}
  }
}
`;

export type PopulationsPageData = z.infer<typeof zPopulationPageData>;
