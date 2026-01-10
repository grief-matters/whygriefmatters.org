import { z } from "astro:content";

/**
 * Create a readonly set of content types that match our CMS content block schemas
 */
const contentTypes = [
  "accessibleImage",
  "categoryPageLink",
  "featuredCrisisResource",
  "featuredResource",
  "featuredResources",
  "featuredWebsite",
  "featuredWebsites",
  "headingText",
  "imageRow",
  "pageLinks",
  "relativeLink",
  "resourceLinks",
  "resourcePageLink",
  "richTextWithHeading",
  // TODO - we need to fix this type name but it will require a migration
  "richTextContentBlock",
] as const;
export const zContentType = z.enum(contentTypes);
export type ContentBlockType = z.infer<typeof zContentType>;
