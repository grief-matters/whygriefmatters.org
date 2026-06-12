import { z } from "astro/zod";

import { zNavItem } from "../navItem";
import { zStaticNavItem } from "../staticNavItem";

export const zNavListItem = z.discriminatedUnion("kind", [
  zNavItem.extend({ kind: z.literal("navItem") }),
  zStaticNavItem.extend({ kind: z.literal("staticNavItem") }),
]);

export const zNavItemsContentItem = z.object({
  contentType: z.literal("navItems"),
  items: z.array(zNavListItem),
});
