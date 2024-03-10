import { z } from "zod";
import {
  gPageResourceListingProjection,
  internetResourceTypes,
  zInternetResourcePageListing,
  zInternetResourceType,
} from "./internetResource";

export const zResourceTypePagesData = z.record(
  zInternetResourceType,
  z.array(zInternetResourcePageListing),
);

export const gResourceTypePagesQuery = `
{
${internetResourceTypes
  .map(
    (t) => `
  "${t}": *[_type == "${t}"]{
    ${gPageResourceListingProjection}
  }`,
  )
  .join(",\n")}
}
`;

export type ResourceTypePageData = z.infer<typeof zResourceTypePagesData>;
