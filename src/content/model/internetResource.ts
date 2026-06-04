import { reference } from "astro:content";
import { z } from "astro/zod";

import { zPortableText } from "./portableText";

/**
 * Description shape. The CMS schema overhaul switched description to plain
 * `text` but legacy records (notably crisis resources and essential services)
 * still hold portable text. Accept both shapes until the CMS data migration
 * lands.
 */
export const zResourceDescription = z
  .union([z.string(), zPortableText])
  .nullable();

/**
 * For ordering and prioritization where needed, these are the most "important" resource types
 */
export const primaryResourceTypes = [
  "article",
  "story",
  "peerSupport",
  "supportGroup",
  "therapyResource",
  "externalOrg",
] as const;

/**
 * Secondary set of Internet Resource types
 */
export const secondaryResourceTypes = [
  "app",
  "blog",
  "book",
  "course",
  "community",
  "crisisResource",
  "essentialService",
  "forum",
  "listicle",
  "memorial",
  "podcast",
  "podcastEpisode",
  "printedMaterial",
  "video",
  "webinar",
] as const;

/**
 * The complete set of Internet Resource types — must stay in sync with
 * the CMS `shared/internet-resource.ts` list.
 */
export const internetResourceTypes = [
  ...primaryResourceTypes,
  ...secondaryResourceTypes,
] as const;
export const zInternetResourceType = z.enum(internetResourceTypes);
export type InternetResourceType = z.infer<typeof zInternetResourceType>;

/**
 * Internet Resource Types that share the base internet resource schema with no extra fields.
 * These collections can be loaded with the shared basic loader.
 */
export const basicInternetResourceTypes: Array<InternetResourceType> = [
  "article",
  "blog",
  "community",
  "course",
  "forum",
  "memorial",
  "printedMaterial",
  "story",
  "video",
  "webinar",
] as const;

/**
 * Use to create manual references where Astro 'astro:content.reference' cannot be used
 * (e.g. inside ContentBlock items that point at heterogenous resource collections).
 */
export const zInternetResourceReference = z.object({
  refType: z.enum(internetResourceTypes),
  refId: z.string(),
});

/**
 * Audience role classification — whose lens the resource is produced for.
 */
export const zAudienceRole = z.enum(["bereaved", "supporter", "professional"]);
export type AudienceRole = z.infer<typeof zAudienceRole>;

/**
 * Available languages enumeration.
 */
export const zAvailableLanguage = z.enum(["english", "spanish"]);
export type AvailableLanguage = z.infer<typeof zAvailableLanguage>;

/**
 * The standard Zod schema for a basic Internet Resource — mirrors the field
 * set produced by `createBaseInternetResourceSchema` in the CMS.
 */
export const zBasicInternetResource = z.object({
  id: z.string(),
  updatedAt: z.string().datetime(),
  title: z.string(),
  description: zResourceDescription,
  resourceUrl: z.string().url().nullable(),
  sourceOrgId: reference("externalOrgs").nullable(),
  imageAssetId: reference("imageAssets").nullable(),
  availableLanguages: z.array(zAvailableLanguage),
  paywalled: z.boolean(),
  registrationRequired: z.boolean(),
  skipLinkCheck: z.boolean(),
  skipLinkCheckReason: z.string().nullable(),
  audienceRole: z.array(zAudienceRole).nullable(),
  lossRelationships: z.array(reference("lossRelationships")),
  causesOfDeath: z.array(reference("causesOfDeath")),
  themes: z.array(reference("themes")),
  demographics: z.array(reference("demographics")),
  griefPhases: z.array(reference("griefPhases")),
  griefTypes: z.array(reference("griefTypes")),
  contentFunctions: z.array(reference("contentFunctions")),
  emotionalStates: z.array(reference("emotionalStates")),
  searchAliases: z.array(z.string()),
});

export type BasicInternetResource = z.infer<typeof zBasicInternetResource>;
