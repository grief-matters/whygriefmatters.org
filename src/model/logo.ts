import groq from "groq";
import { z } from "zod";

import { zImage } from "./image";

const logoVariants = ["dark-primary", "light-secondary"] as const;

export const zLogoVariant = z.enum(logoVariants);

export const zLogo = zImage.extend({
  variant: zLogoVariant,
});

export const gLogosQuery = groq`
*[_id == 'organization-singleton']{
  logos[]{
    variant,
    "image": logo.image,
    "altText": logo.alt,
  }
}.logos[]
`;

export type Logo = z.infer<typeof zLogo>;
export type LogoVariant = z.infer<typeof zLogoVariant>;
