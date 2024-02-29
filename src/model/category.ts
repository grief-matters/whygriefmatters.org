import groq from "groq";
import { z } from "zod";
import { zArticle, zInternetResource, zStory } from "./internetResource";

export const zCategory = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  featuredArticles: z.array(zArticle).optional().nullable(),
  featuredStories: z.array(zStory).optional().nullable(),
});

export const zCategoryWithParent = zCategory.extend({
  parent: zCategory.nullable(),
});

export type Category = z.infer<typeof zCategoryWithParent>;

export const getCategoryQuery = groq`
*[_type == "category" && slug.current == $category][0]{
  title,
  "slug": slug.current,
  description,
  parent->{
    title,
    "slug": slug.current,
    description,
  },
  featuredArticles[]->{
    "type": _type,
    "title": coalesce(title, name),
    description,
    resourceUrl,
    sourceWebsite->{
      name,
      directlyQuoted,
      resourceUrl,
    },
    image{
      image,
      "altText": alt
    }
  },
  featuredStories[]->{
    "type": _type,
    "title": coalesce(title, name),
    description,
    resourceUrl,
    sourceWebsite->{
      name,
      directlyQuoted,
      resourceUrl,
    },
    image{
      image,
      "altText": alt
    }
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

export const getCategoriesForPopulationQuery = groq`
array::compact(*[$populationSlug in populations[]->slug.current].categories[]->{
  title,
  "slug": slug.current,
  description,
  parent->{
    title,
    "slug": slug.current,
    description,
  }
})
`;

// TODO - this query needs work to resolve dupes itself
export const getCategoriesForResourceTypeQuery = groq`
array::compact(*[_type == $resourceType].categories[]->{
  title,
  "slug": slug.current,
  description,
  parent->{
    title,
    "slug": slug.current,
    description,
  }
})
`;
