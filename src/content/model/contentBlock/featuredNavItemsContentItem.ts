import { z } from "astro/zod";

import { zNavListItem } from "./navItemsContentItem";

export const zFeaturedNavItemsContentItem = z.object({
  contentType: z.literal("featuredNavItems"),
  items: z.array(zNavListItem),
});
