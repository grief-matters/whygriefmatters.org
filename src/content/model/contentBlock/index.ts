import { z } from "astro:content";
import type { ZodDiscriminatedUnionOption } from "astro:schema";

import accessibleImage from "./accessibleImageContentItem";
import categoryPageLink from "./categoryPageLinkContentItem";
import featuredCrisisResource from "./featuredCrisisResourceContentItem";
import featuredResource from "./featuredResourceContentItem";
import featuredResources from "./featuredResourcesContentItem";
import featuredWebsite from "./featuredWebsiteContentItem";
import featuredWebsites from "./featuredWebsitesContentItem";
import headingText from "./headingTextContentItem";
import imageRow from "./imageRowContentItem";
import pageLinks from "./pageLinksContentItem";
import relativePageLink from "./relativeLinkContentItem";
import resourceLinks from "./resourceLinksContentItem";
import resourcePageLink from "./resourcePageLinkContentItem";
import richTextContentBlock from "./richTextContentItem";
import richTextWithHeading from "./richTextWithHeadingContentItem";
import { zNonEmptyString } from "../utils";

/**
 * Create a keyed set of schemas to ensure we add new content types correctly
 */
const contentBlockSchemas = [
  accessibleImage,
  categoryPageLink,
  featuredCrisisResource,
  featuredResource,
  featuredResources,
  featuredWebsite,
  featuredWebsites,
  headingText,
  imageRow,
  pageLinks,
  relativePageLink,
  resourceLinks,
  resourcePageLink,
  richTextWithHeading,
  richTextContentBlock,
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

export type PageLinks = z.infer<typeof pageLinks>;
