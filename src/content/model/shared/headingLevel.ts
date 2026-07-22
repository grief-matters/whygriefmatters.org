import { z } from "astro/zod";

export const zHeadingLevel = z.enum(["h1", "h2"]);

export type ContentBlockHeadingLevel = z.infer<typeof zHeadingLevel>;
