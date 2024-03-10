import { z } from "zod";
import type { TypedObject } from "@portabletext/types";

import { zSchemaForType } from "./helpers";

/**
 * Zod schema for the `TypedObject` Type from Portable Text
 */
const zBaseTypedObject = z
  .object({
    _type: z.string(),
    _key: z.string(),
  })
  .passthrough();

export const zTypedObject = zSchemaForType<TypedObject>()(zBaseTypedObject);

/**
 * This will satisfy the `value` parameter for the `toHTML` function from `@portabletext/to-html`
 */
export const zPortableText = z.array(zTypedObject);

export const zRichTextContentBlock = z.object({
  portableText: zPortableText,
});

export type PortableText = z.infer<typeof zPortableText>;
export type RichTextContentBlock = z.infer<typeof zRichTextContentBlock>;
