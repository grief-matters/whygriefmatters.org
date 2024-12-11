import { z } from "zod";
import groq from "groq";

import { zPortableText } from "./portableText";
import { zImage } from "./image";
import { gContentGroupProjection, zContentGroup } from "./contentGroup";

export const zFooterData = z.object({
    logo: zImage,
    copyrightDate: z.coerce.date(),
    copyrightNotice: z.string(),
    organizationName: z.string(),
    legalText: zPortableText,
});

export const gFooterDataQuery = groq`
*[_id == "organization-singleton"][0]{
    "logo": zImage,
    "copyrightDate": z.coerce.date(),
    "copyrightNotice": z.string(),
    "organizationName": z.string(),
    "legalText": zPortableText,
`;

export type FooterData = z.infer<typeof zFooterData>;
