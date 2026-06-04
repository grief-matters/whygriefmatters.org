import { z } from "astro/zod";

import { zPortableText } from "./portableText";
import { zSanityImage } from "./image";

const zSocials = z.object({
  linkedIn: z.url().nullable(),
  email: z.email().nullable(),
});

export type SocialVal = keyof z.infer<typeof zSocials>;

export default z.object({
  id: z.string(),
  fullName: z.string(),
  role: z.string().nullable(),
  shortBio: zPortableText.nullable(),
  personalStory: zPortableText.nullable(),
  avatar: zSanityImage.nullable(),
  socials: zSocials.nullable(),
});
