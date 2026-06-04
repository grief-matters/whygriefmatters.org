import { z } from "astro/zod";

import { zNavItem } from "../navigationTree";

export default z.object({
  contentType: z.literal("navItems"),
  items: z.array(zNavItem),
});
