import { z } from "astro/zod";
import type { TypedObject } from "@portabletext/types";

import { zSchemaForType } from "./utils";

/**
 * Zod schema for the `TypedObject` Type from Portable Text
 */
const zBaseTypedObject = z.looseObject({
  _type: z.string(),
  _key: z.string(),
});

export const zTypedObject = zSchemaForType<TypedObject>()(zBaseTypedObject);

/**
 * This will satisfy the `value` parameter for the `toHTML` function from `@portabletext/to-html`
 */
export const zPortableText = z.array(zTypedObject);

export type PortableText = z.infer<typeof zPortableText>;
