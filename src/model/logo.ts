import groq from "groq";
import { z } from "zod";

import { zImage } from "./common";

const logoVariants = ["dark-primary", "light-secondary"] as const;
export const zLogoVariant = z.enum(logoVariants);
export type LogoVariant = z.infer<typeof zLogoVariant>;

export const zLogo = zImage.extend({
  variant: zLogoVariant,
});

export type Logo = z.infer<typeof zLogo>;

export const getLogosQuery = groq`
*[_id == 'organization-singleton']{
  logos[]{
    variant,
    "image": logo.image,
    "altText": logo.alt,
  }
}.logos[]
`;
