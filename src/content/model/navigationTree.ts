import { z } from "astro/zod";

import { zNavItem } from "./navItem";
import { zStaticNavItem } from "./staticNavItem";

/**
 * Recursive `navItem | staticNavItem | navItemGroup` discriminated union used
 * inside a `navigationTree`. The recursion uses Zod-v4's getter pattern;
 * TypeScript can't infer the output type of a recursive discriminated union on
 * its own, so we hand-roll the output type and annotate the schema with
 * `z.ZodType<T>` (the documented v4 escape hatch — see zod.dev/api "recursive
 * types").
 */
export type NavigationTreeItem =
  | (z.infer<typeof zNavItem> & { kind: "navItem" })
  | (z.infer<typeof zStaticNavItem> & { kind: "staticNavItem" })
  | {
      kind: "navItemGroup";
      label: string | null;
      items: NavigationTreeItem[];
    };

export const zNavigationTreeItem: z.ZodType<NavigationTreeItem> =
  z.discriminatedUnion("kind", [
    zNavItem.extend({ kind: z.literal("navItem") }),
    zStaticNavItem.extend({ kind: z.literal("staticNavItem") }),
    z.object({
      kind: z.literal("navItemGroup"),
      label: z.string().nullable(),
      get items() {
        return z.array(zNavigationTreeItem);
      },
    }),
  ]);

export const zNavigationTree = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  items: z.array(zNavigationTreeItem),
});
