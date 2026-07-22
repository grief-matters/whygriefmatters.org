import { z } from "astro/zod";
import { getCollection } from "astro:content";
import type { zForm } from "@content/model/form";

export type Form = z.infer<typeof zForm>;
export type FormField = Form["fields"][number];

export type FieldErrors = Record<string, string[]>;

export async function getFormByFormId(formId: string) {
  const all = await getCollection("forms");
  return all.find((f) => f.data.formId === formId);
}

export function buildFormInputSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    formId: z.string(),
    website: z.string().optional(),
  };

  for (const field of fields) {
    shape[field.name] = buildFieldSchema(field);
  }

  return z.object(shape);
}

function buildFieldSchema(field: FormField): z.ZodTypeAny {
  switch (field.type) {
    case "email": {
      const base = z.email(`${field.label} must be a valid email`);
      return field.required ? base : z.union([z.literal(""), base]).optional();
    }
    case "number": {
      const base = z.coerce.number({
        error: `${field.label} must be a number`,
      });
      return field.required
        ? base
        : z
            .union([z.literal(""), base])
            .optional()
            .transform((v) => (v === "" || v === undefined ? undefined : v));
    }
    case "checkbox": {
      const base = z.preprocess(
        (v) => v === "on" || v === "true" || v === true,
        z.boolean(),
      );
      return field.required
        ? base.refine((v) => v === true, {
            message: `${field.label} is required`,
          })
        : base;
    }
    case "select":
    case "radio": {
      const options = field.inputOptions ?? [];
      const base =
        options.length > 0
          ? z.enum(options as [string, ...string[]], {
              error: `${field.label} must be one of the available options`,
            })
          : z.string();
      return field.required ? base : z.union([z.literal(""), base]).optional();
    }
    case "textarea":
    case "text":
    default: {
      return field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional();
    }
  }
}

export function formatSubmissionEmail(
  form: Form,
  data: Record<string, unknown>,
) {
  const rows = form.fields.map((f) => {
    const raw = data[f.name];
    const display =
      raw === undefined || raw === null || raw === "" ? "—" : String(raw);
    return { label: f.label, value: display };
  });

  const subject = `[${form.title}] new submission`;
  const text = rows.map((r) => `${r.label}: ${r.value}`).join("\n");
  const html = `<table style="font-family:sans-serif;border-collapse:collapse">${rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 12px;font-weight:600;vertical-align:top">${escapeHtml(
          r.label,
        )}</td><td style="padding:8px 12px;white-space:pre-wrap">${escapeHtml(
          r.value,
        )}</td></tr>`,
    )
    .join("")}</table>`;

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
