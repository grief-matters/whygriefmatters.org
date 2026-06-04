import { z } from "astro/zod";

import { zNavItem } from "../navigationTree";

export const zNavItemsContentItem = z.object({
  contentType: z.literal("navItems"),
  items: z.array(zNavItem),
});
