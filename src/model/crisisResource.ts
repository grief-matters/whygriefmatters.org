import groq from "groq";
import { z } from "zod";
import { zPortableText } from "./portableText";

// TODO - this shouldn't all be optional - but it is in the Sanity schema
export const zCrisisResource = z.object({
  title: z.string(),
  description: zPortableText.nullable(),
  resourceUrl: z.string().url().nullable(),
  sourceWebsite: z
    .object({
      name: z.string(),
      resourceUrl: z.string().url(),
    })
    .nullable(),
  liveChat: z.string().url().nullable(),
  email: z.string().email().nullable(),
  populations: z.array(z.string()).nullable(),
  contactNumbers: z
    .array(
      z.object({
        type: z.string().nullable(),
        number: z.string().nullable(),
        label: z.string().nullable(),
      }),
    )
    .nullable(),
});

export const gCrisisResourcesQuery = groq`
  *[_type == "crisisResource"]{
    "title": name,
    description,
    resourceUrl,
    email,
    liveChat,
    sourceWebsite->{
      name,
      resourceUrl,
    },
    "populations": populations[]->slug.current,
    contactNumbers[]{
      type,
      number,
      label,
    },
  }
`;

export type CrisisResource = z.infer<typeof zCrisisResource>;
