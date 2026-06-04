import { z } from "astro/zod";

import { zInternetResourceType } from "./internetResource";

const taxonomyRefTypes = [
  "lossRelationship",
  "causeOfDeath",
  "theme",
  "demographic",
  "griefPhase",
  "griefType",
  "emotionalState",
  "contentFunction",
] as const;
export const zTaxonomyRefType = z.enum(taxonomyRefTypes);
export type TaxonomyRefType = z.infer<typeof zTaxonomyRefType>;

export const zTaxonomyReference = z.object({
  refType: zTaxonomyRefType,
  refId: z.string(),
});

/**
 * Shape of a single `navItem` object — reused by `navigationTree`, the
 * `navItem` ContentBlock item, and the `navItems` ContentBlock item.
 *
 * Does NOT carry the `kind` discriminator; the navigationTree variant adds
 * `kind: "navItem"` when composing the discriminated union below.
 */
export const zNavItem = z.object({
  label: z.string().nullable(),
  entryPoint: zTaxonomyReference,
  filters: z.array(zTaxonomyReference),
  mediaTypes: z.array(zInternetResourceType).nullable(),
});
export type NavItem = z.infer<typeof zNavItem>;

/**
 * Recursive `navItem | navItemGroup` discriminated union used inside a
 * `navigationTree`. The recursion uses Zod-v4's getter pattern; TypeScript
 * can't infer the output type of a recursive discriminated union on its own,
 * so we hand-roll the output type and annotate the schema with `z.ZodType<T>`
 * (the documented v4 escape hatch — see zod.dev/api "recursive types").
 */
export type NavigationTreeItem =
  | (NavItem & { kind: "navItem" })
  | {
      kind: "navItemGroup";
      label: string | null;
      items: NavigationTreeItem[];
    };

export const zNavigationTreeItem: z.ZodType<NavigationTreeItem> =
  z.discriminatedUnion("kind", [
    zNavItem.extend({ kind: z.literal("navItem") }),
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
