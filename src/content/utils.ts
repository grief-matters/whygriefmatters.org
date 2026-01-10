import { defineCollection } from "astro:content";

import zBasicInternetResource, {
  type InternetResourceType,
} from "./model/internetResource";
import { loadSanityQuery } from "./loaders/sanityQueryLoader";

import basicInternetResourceQuery from "./queries/basicInternetResource.groq?raw";

export function getBasicInternetResourceCollectionDef(
  resourceType: InternetResourceType,
) {
  return defineCollection({
    loader: async () =>
      loadSanityQuery({
        query: basicInternetResourceQuery,
        queryParams: { resourceType },
        schema: zBasicInternetResource,
      }),
    schema: zBasicInternetResource,
  });
}
