import { z } from "astro/zod";

import { zNavItem } from "../navItem";

export const zNavItemContentItem = zNavItem.extend({
  contentType: z.literal("navItem"),
});
