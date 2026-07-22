import { reference } from "astro:content";
import { z } from "astro/zod";

import { zAvailableLanguage, zResourceDescription } from "./internetResource";
import { zContactMethod } from "./shared/contactMethod";

/**
 * Essential Service is hand-rolled in the CMS and intentionally exposes a
 * subset of the base internet resource fields. It excludes most taxonomy
 * classifications (only themes + demographics), audience role, grief phases,
 * grief types, content functions, emotional states, and adds contact methods.
 */
export const zEssentialService = z.object({
  id: z.string(),
  updatedAt: z.iso.datetime(),
  title: z.string(),
  description: zResourceDescription,
  resourceUrl: z.url().nullable(),
  sourceOrgId: reference("externalOrgs").nullable(),
  imageAssetId: reference("imageAssets").nullable(),
  availableLanguages: z.array(zAvailableLanguage),
  paywalled: z.boolean(),
  registrationRequired: z.boolean(),
  skipLinkCheck: z.boolean(),
  skipLinkCheckReason: z.string().nullable(),
  themes: z.array(reference("themes")),
  demographics: z.array(reference("demographics")),
  searchAliases: z.array(z.string()),
  contactMethods: z.array(zContactMethod).nullable(),
});

export type EssentialService = z.infer<typeof zEssentialService>;
