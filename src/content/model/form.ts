import { z } from "astro:content";

const zFormFieldType = z.enum([
  "text",
  "email",
  "number",
  "textarea",
  "select",
  "checkbox",
  "radio",
]);

const zFormField = z.object({
  label: z.string(),
  description: z.string().nullable(),
  name: z.string(),
  type: zFormFieldType,
  inputOptions: z.array(z.string()).nullable(),
  placeholder: z.string().nullable(),
  required: z.boolean(),
});

export const zForm = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  fields: z.array(zFormField),
  submitButtonText: z.string(),
  successMessage: z.string(),
});
