import { z } from "zod";
import groq from "groq";
import { zSanityImage } from "./image";
import { zPortableText } from "./portableText";

export const gPersonProjection = groq`
    fullName,
    role,
    avatar,
    bio
`;

export const zPerson = z.object({
  fullName: z.string(),
  role: z.string().nullable(),
  bio: zPortableText,
  avatar: zSanityImage.nullable(),
});

export type Person = z.infer<typeof zPerson>;
