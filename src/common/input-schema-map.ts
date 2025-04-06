import { zContactInput } from "@model/contactFormInput";
import type { ZodSchema } from "zod";

export const inputSchemaMap: Record<string, ZodSchema<any>> = {
  contact: zContactInput,
};
