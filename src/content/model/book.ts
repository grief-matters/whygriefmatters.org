import { z } from "astro/zod";

import { zBasicInternetResource } from "./internetResource";

export const zBook = zBasicInternetResource.extend({
  author: z.string().nullable(),
  isbn: z.string().nullable(),
});

export type Book = z.infer<typeof zBook>;
