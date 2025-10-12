import { defineCollection, reference, z } from "astro:content";

import groq from "groq";

import { getClient } from "@common/client";
import { zImage } from "@model/image";
import { internetResourceTypes } from "@model/internetResource";

/**
 * Use to create manual references where Astro 'astro:content.reference' cannot be used
 */
const zManualResourceRef = z.object({
  refType: z.enum(internetResourceTypes),
  refId: z.string(),
});

export default defineCollection({
  loader: async () => {
    // TODO - featuredResources currently concatenates the separate schemas, needs updating when schemas get updated
    const query = groq`
      *[_type == 'category'] {
        "id": _id,
        title,
        "slug": slug.current,
        description,
        image{
          image,
          "altText": alt
        },
        "subcategories": coalesce(subtopics[]->._id, []),
        "featuredResources": coalesce(
          (featuredStories[]->{"refType": _type,"refId": _id}) + 
          (featuredArticles[]->{"refType": _type, "refId": _id}), 
          []
        ),
      }
    `;

    return await getClient()
      .fetch(query)
      .then((result) => result);
  },
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    image: zImage.nullable(),
    subcategories: z.array(reference("categories")),
    featuredResources: z.array(zManualResourceRef),
  }),
});
