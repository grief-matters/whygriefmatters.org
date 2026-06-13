import { z } from "astro/zod";

import { zBasicInternetResource } from "./internetResource";

export const zBook = zBasicInternetResource.extend({
  author: z.string().nullable(),
  isbn: z.string().nullable(),
  coverUrl: z.url().nullable().default(null),
  amazonUrl: z.url().nullable().default(null),
  barnesAndNobleUrl: z.url().nullable().default(null),
  bookshopUrl: z.url().nullable().default(null),
});

export type Book = z.infer<typeof zBook>;
