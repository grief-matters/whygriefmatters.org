import { getClient } from "@common/client";
import { defineCollection, z } from "astro:content";

import groq from "groq";

export default defineCollection({
  loader: async () => {
    const query = groq`
      *[_type == 'website']{
        "id": _id,
        resourceUrl,
        name,
        description,
      }
    `;

    return await getClient()
      .fetch(query)
      .then((result) => result);
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    resourceUrl: z.string().url(),
    description: z.string().nullable(),
  }),
});
