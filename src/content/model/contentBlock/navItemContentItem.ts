import { z } from "astro/zod";

import { zNavItem } from "../navigationTree";

export const zNavItemContentItem = zNavItem.extend({
  contentType: z.literal("navItem"),
});
