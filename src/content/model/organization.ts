import { z } from "astro:content";

import { zSanityImage } from "./image";
import { zPortableText } from "./portableText";
import { zNonEmptyString } from "./utils";

const logoVariants = ["onLight", "onDark", "onDarkMono"] as const;
const zLogoVariant = z.enum(logoVariants);

export const zOrganization = z.object({
  name: zNonEmptyString,
  slogan: zNonEmptyString,
  legalName: zNonEmptyString,
  copyrightNotice: zNonEmptyString,
  nonprofitNotice: zNonEmptyString,
  smallPrint: zPortableText,
  missionStatement: zPortableText,
  logos: z.record(zLogoVariant, zSanityImage),
});

export type Organization = z.infer<typeof zOrganization>;
