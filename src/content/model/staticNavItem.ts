import { z } from "astro/zod";

import { zNonEmptyString } from "./utils";

/**
 * A `staticNavItem` is a hand-written link slot (label + internal URL). It's a
 * primitive used inside `navigationTree` and content blocks wherever an
 * editor needs to point at an arbitrary path rather than a taxonomy.
 */
export const zStaticNavItem = z.object({
  label: zNonEmptyString,
  url: zNonEmptyString.startsWith("/"),
});
export type StaticNavItem = z.infer<typeof zStaticNavItem>;
