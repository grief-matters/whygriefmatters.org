import { z } from "astro/zod";
import type { ZodDiscriminatedUnionOption } from "astro:schema";

import featuredResource from "./featuredResourceContentItem";
import featuredResources from "./featuredResourcesContentItem";
import headingText from "./headingTextContentItem";
import imageAsset from "./imageAssetContentItem";
import imageRow from "./imageRowContentItem";
import navItem from "./navItemContentItem";
import navItems from "./navItemsContentItem";
import person from "./personContentItem";
import personGroup from "./personGroupContentItem";
import resourceLinks from "./resourceLinksContentItem";
import richTextContentBlock from "./richTextContentItem";
import richTextWithHeading from "./richTextWithHeadingContentItem";
import staticNavItem from "./staticNavItemContentItem";
import { zNonEmptyString } from "../utils";

/**
 * Create a keyed set of schemas to ensure we add new content types correctly
 */
const contentBlockSchemas = [
  featuredResource,
  featuredResources,
  headingText,
  imageAsset,
  imageRow,
  navItem,
  navItems,
  person,
  personGroup,
  resourceLinks,
  richTextContentBlock,
  richTextWithHeading,
  staticNavItem,
] as const satisfies readonly [
  ZodDiscriminatedUnionOption<"contentType">,
  ...ZodDiscriminatedUnionOption<"contentType">[],
];

/**
 * Automatically build our content block schema from our keyed object
 */
export default z.object({
  id: zNonEmptyString,
  content: z.array(z.discriminatedUnion("contentType", contentBlockSchemas)),
});
