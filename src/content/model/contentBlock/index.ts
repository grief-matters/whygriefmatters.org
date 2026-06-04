import { z } from "astro/zod";

import { zFeaturedResourceContentItem } from "./featuredResourceContentItem";
import { zFeaturedResourcesContentItem } from "./featuredResourcesContentItem";
import { zHeadingTextContentItem } from "./headingTextContentItem";
import { zImageAssetContentItem } from "./imageAssetContentItem";
import { zImageRowContentItem } from "./imageRowContentItem";
import { zNavItemContentItem } from "./navItemContentItem";
import { zNavItemsContentItem } from "./navItemsContentItem";
import { zPersonContentItem } from "./personContentItem";
import { zPersonGroupContentItem } from "./personGroupContentItem";
import { zResourceLinksContentItem } from "./resourceLinksContentItem";
import { zRichTextContentItem } from "./richTextContentItem";
import { zRichTextWithHeadingContentItem } from "./richTextWithHeadingContentItem";
import { zStaticNavItemContentItem } from "./staticNavItemContentItem";
import { zNonEmptyString } from "../utils";

const contentItemSchemas = [
  zFeaturedResourceContentItem,
  zFeaturedResourcesContentItem,
  zHeadingTextContentItem,
  zImageAssetContentItem,
  zImageRowContentItem,
  zNavItemContentItem,
  zNavItemsContentItem,
  zPersonContentItem,
  zPersonGroupContentItem,
  zResourceLinksContentItem,
  zRichTextContentItem,
  zRichTextWithHeadingContentItem,
  zStaticNavItemContentItem,
] as const;

export const zContentBlock = z.object({
  id: zNonEmptyString,
  content: z.array(z.discriminatedUnion("contentType", contentItemSchemas)),
});

export type ContentBlock = z.infer<typeof zContentBlock>;

/**
 * Content types the frontend knows how to render — derived from the schemas
 * above so adding a new content item updates this set automatically. Used to
 * drop unknown CMS content types before validation, which lets the CMS ship
 * new types ahead of the frontend without breaking the build.
 */
export const knownContentTypes = new Set<string>(
  contentItemSchemas.map((s) => s.shape.contentType.value),
);
