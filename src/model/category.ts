import groq from "groq";
import { z } from "zod";

export const zCategory = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
});

export const zCategoryWithParent = zCategory.extend({
  parent: zCategory.nullable(),
});

export type Category = z.infer<typeof zCategoryWithParent>;

export const categoryQuery = groq`
*[_type == "category" && slug.current == $category][0]{
  title,
  "slug": slug.current,
  description,
  parent->{
    title,
    "slug": slug.current,
    description,
  }
}
`;

export const getCategoriesQuery = groq`
*[_type == "category"]{
  title,
  "slug": slug.current,
  description,
  parent->{
    title,
    "slug": slug.current,
    description,
  }
}
`;

export const getFeaturedTopicsQuery = groq`
*[_id == "featuredTopics-singleton"][0]{
  topics[]->{
    title,
    "slug": slug.current,
    description,
  }
}
`;
