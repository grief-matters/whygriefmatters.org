import { z } from "astro/zod";

import { zStaticNavItem } from "../staticNavItem";

export const zStaticNavItemContentItem = zStaticNavItem.extend({
  contentType: z.literal("staticNavItem"),
});
