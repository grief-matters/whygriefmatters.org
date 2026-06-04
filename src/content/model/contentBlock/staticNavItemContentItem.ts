import { z } from "astro/zod";

import { zNonEmptyString } from "../utils";

export default z.object({
  contentType: z.literal("staticNavItem"),
  label: zNonEmptyString,
  url: zNonEmptyString.startsWith("/"),
});
