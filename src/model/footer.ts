import { z } from "zod";
import groq from "groq";

import { zPortableText } from "./portableText";
import { zImage } from "./image";

export const zFooterData = z.object({
    logo: zImage,
    copyrightDate: z.coerce.date(),
    copyrightNotice: z.string(),
    organizationName: z.string(),
    legalText: zPortableText,
});

export const gFooterDataQuery = groq`*[_id == "organization-singleton"][0]{
    "logo": logos[@.variant == "light-secondary"][0]{
        "image": logo.image,
        "altText": logo.alt
      },
    "copyrightDate": dateTime(now()),
    copyrightNotice,
    "organizationName": legalName,
    "legalText": smallPrint,
  }`;

export type FooterData = z.infer<typeof zFooterData>;
