import { z } from "astro:content";

import zCategoryPageLinkContentItem from "./categoryPageLinkContentItem";
import zRelativePageLinkContentItem from "./relativeLinkContentItem";
import zResourcePageLinkContentItem from "./resourcePageLinkContentItem";
import { zContentType } from "./contentType";

export default z.object({
  contentType: z.literal(zContentType.Enum.pageLinks),
  emphasized: z.boolean(),
  links: z.array(
    z.discriminatedUnion("contentType", [
      zCategoryPageLinkContentItem,
      zResourcePageLinkContentItem,
      zRelativePageLinkContentItem,
    ]),
  ),
});
