import { z, reference } from "astro:content";

import { zNonEmptyString } from "../utils";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.categoryPageLink),
  category: reference("categories"),
  label: zNonEmptyString.nullable(),
});
