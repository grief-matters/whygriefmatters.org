import { z } from "astro/zod";

/**
 * Create a readonly set of content types that match our CMS content block schemas
 */
const contentTypes = [
  "headingText",
  "richTextContentBlock",
  "richTextWithHeading",
  "imageAsset",
  "imageRow",
  "featuredResource",
  "featuredResources",
  "staticNavItem",
  "navItem",
  "navItems",
  "resourceLinks",
  "person",
  "personGroup",
] as const;
export const zContentType = z.enum(contentTypes);
export type ContentBlockType = z.infer<typeof zContentType>;

export const knownContentTypes = new Set<string>(zContentType.options);
