import { z } from "zod";
import groq from "groq";

import {
  gPageResourceListingProjection,
  zExtendedResourceType,
  zInternetResourcePageListing,
} from "./internetResource";
import { zImage } from "./image";

export function getQueryForCollectionResources(collection: SmartCollection) {
  const queryFilter = [
    collection.types.length > 0
      ? `_type in ${JSON.stringify(collection.types)}`
      : null,
    collection.categories.length > 0
      ? `(${collection.categories
          .map((p) => `categories[]->slug.current match "${p.slug}"`)
          .join(" || ")})`
      : null,
    collection.populations.length > 0
      ? `(${collection.populations
          .map((p) => `populations[]->slug.current match "${p.slug}"`)
          .join(" || ")})`
      : null,
  ]
    .filter((x) => x !== null)
    .join(" && ");

  return `*[${queryFilter}]{
      ${gPageResourceListingProjection}
    }`;
}

export const gSmartCollectionProjection = groq`
  title,
  "slug": slug.current,
  image{
    image,
    "altText": alt
  },
  "categories": coalesce(categories[]->{
    "slug": slug.current,
    title
  }, []),
  "populations": coalesce(populations[]->{
    "slug": slug.current,
    name
  }, []),
  "types": coalesce(types, []),
  shouldGenerateStaticPath
`;

export const gSmartCollectionPagesQuery = groq`
  *[_type == "smartResourceCollection"]{
    ${gSmartCollectionProjection}
  }
`;

export const zSmartCollection = z.object({
  title: z.string(),
  slug: z.string(),
  image: zImage.nullish(),
  categories: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
    }),
  ),
  populations: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
    }),
  ),
  types: z.array(zExtendedResourceType),
  shouldGenerateStaticPath: z.boolean(),
});

export const zSmartCollectionPage = zSmartCollection.extend({
  resources: zInternetResourcePageListing.array(),
});

export type SmartCollection = z.infer<typeof zSmartCollection>;
export type SmartCollectionPage = z.infer<typeof zSmartCollectionPage>;
