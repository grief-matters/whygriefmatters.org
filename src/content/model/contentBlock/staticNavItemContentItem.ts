import { z } from "astro/zod";

import { zNonEmptyString } from "../utils";

export const zStaticNavItemContentItem = z.object({
  contentType: z.literal("staticNavItem"),
  label: zNonEmptyString,
  url: zNonEmptyString.startsWith("/"),
});
