import { z, reference } from "astro:content";

import { zImage } from "./image";
import { zInternetResourceReference } from "./internetResource";
import { zPortableText } from "./portableText";

export const zCategory = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  displayTitle: z.string().nullable(),
  shortDescription: z.string().nullable(),
  description: zPortableText.nullable(),
  image: zImage.nullable(),
  subcategories: z.array(reference("categories")),
  featuredResources: z.array(zInternetResourceReference),
});
