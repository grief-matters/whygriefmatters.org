import groq from "groq";
import { z } from "zod";

const zCategoryBase = z.object({
  title: z.string(),
  slug: z.string(),
});

export const zCategory = zCategoryBase.extend({
  parent: zCategoryBase.nullish(),
});

/**
 * Creates the GROQ query with a custom filter
 *
 * @param queryFilter - valid GROQ inserted into the main filter
 * @returns
 */
export const gCategoriesByFilterQuery = (queryFilter: string) => groq`
array::compact(*[${queryFilter}].categories[]->{
  title,
  "slug": slug.current
})
`;

export const gCategoriesQuery = groq`
*[_type == "category"]{
  title,
  "slug": slug.current,
  parent->{
    title,
    "slug": slug.current,
  }
}
`;

export const gFeaturedTopicsQuery = groq`
*[_id == "featuredTopics-singleton"][0]{
  topics[]->{
    title,
    "slug": slug.current,
  }
}
`;

export type Category = z.infer<typeof zCategory>;
