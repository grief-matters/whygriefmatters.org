import { z } from "astro/zod";

import { zNavItem } from "../navigationTree";
import { zNonEmptyString } from "../utils";

export const zNavListItem = z.discriminatedUnion("kind", [
  zNavItem.extend({ kind: z.literal("navItem") }),
  z.object({
    kind: z.literal("staticNavItem"),
    label: zNonEmptyString,
    url: zNonEmptyString.startsWith("/"),
  }),
]);

export const zNavItemsContentItem = z.object({
  contentType: z.literal("navItems"),
  items: z.array(zNavListItem),
});
