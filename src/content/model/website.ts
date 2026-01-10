import { reference, z } from "astro:content";
import { zSanityImage } from "./image";

export default z.object({
  id: z.string(),
  name: z.string(),
  updatedAt: z.string().datetime(),
  resourceUrl: z.string().url(),
  description: z.string().nullable(),
  categories: z.array(reference("categories")),
  populations: z.array(reference("populations")),
  logo: zSanityImage.nullable(),
});
