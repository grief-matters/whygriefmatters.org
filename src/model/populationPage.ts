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

/*
issue-84: temp removal of 'book' and 'course'
remove from (_type != 'crisisResource' && _type != 'book' && _type != 'course') 
when type should be added back to site
*/
export const gPopulationsPageData = groq`
*[_type == "population"]{
  name,
  "slug": slug.current,
  image{
    image,
    "altText": alt
  },
  "resources": *[^.slug.current in populations[]->slug.current && (_type != 'crisisResource' && _type != 'book' && _type != 'course')]{
    categories[]->{
      title,
      "slug": slug.current
    },
    ${gPageResourceListingProjection}
  }
}
`;

export type PopulationsPageData = z.infer<typeof zPopulationPageData>;
