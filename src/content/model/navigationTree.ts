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
 */
export const zNavItem = z.object({
  label: z.string().nullable(),
  entryPoint: zTaxonomyReference,
  filters: z.array(zTaxonomyReference),
  mediaTypes: z.array(zInternetResourceType).nullable(),
});
export type NavItem = z.infer<typeof zNavItem>;

type NavItemDiscriminated = NavItem & { kind: "navItem" };
type NavItemGroup = {
  kind: "navItemGroup";
  label: string | null;
  items: Array<NavItemDiscriminated | NavItemGroup>;
};

const zNavItemDiscriminated = zNavItem.extend({
  kind: z.literal("navItem"),
});

const zNavItemGroup: z.ZodType<NavItemGroup> = z.lazy(() =>
  z.object({
    kind: z.literal("navItemGroup"),
    label: z.string().nullable(),
    items: z.array(z.union([zNavItemDiscriminated, zNavItemGroup])),
  }),
);

export const zNavigationTreeItem = z.union([
  zNavItemDiscriminated,
  zNavItemGroup,
]);
export type NavigationTreeItem = z.infer<typeof zNavigationTreeItem>;

export const zNavigationTree = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  items: z.array(zNavigationTreeItem),
});
