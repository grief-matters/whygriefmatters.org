import { z, reference } from "astro:content";

import { zInternetResourceType } from "../internetResource";
import { zNonEmptyString } from "../utils";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.resourcePageLink),
  label: zNonEmptyString,
  category: reference("categories").nullable(),
  resourceTypes: z.array(zInternetResourceType).nullable(),
  population: reference("populations").nullable(),
});
