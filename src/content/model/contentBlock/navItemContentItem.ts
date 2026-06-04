import { z } from "astro/zod";

import { zNavItem } from "../navigationTree";

export default zNavItem.extend({
  contentType: z.literal("navItem"),
});
