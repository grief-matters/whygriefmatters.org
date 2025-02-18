import { z } from "zod";
import groq from "groq";
import { zSanityImage } from "./image";
import { zPortableText } from "./portableText";

export const gPersonProjection = groq`
  fullName,
  shortBio,
  personalStory,
  socials,
  role,
  avatar
`;

export const gPersonPagesQuery = groq`
  *[_type == "person" && defined(personalStory)]{
    ${gPersonProjection}
  }
`;

const zSocials = z.object({
  linkedIn: z.string().url().nullable(),
  email: z.string().email().nullable(),
});

export const zPerson = z.object({
  fullName: z.string(),
  role: z.string().nullable(),
  shortBio: zPortableText,
  personalStory: zPortableText.nullable(),
  avatar: zSanityImage.nullable(),
  socials: zSocials.nullable(),
});

export type Person = z.infer<typeof zPerson>;
