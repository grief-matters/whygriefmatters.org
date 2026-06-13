import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";
import {
  RESEND_API_KEY,
  RESEND_FROM_ADDRESS,
  RESEND_TO_ADDRESS,
} from "astro:env/server";
import {
  buildFormInputSchema,
  formatSubmissionEmail,
  getFormByFormId,
  type FieldErrors,
} from "@lib/forms";

type SubmitFormResult =
  | { ok: true }
  | { ok: false; fieldErrors: FieldErrors };

export const server = {
  submitForm: defineAction({
    accept: "form",
    input: z.looseObject({
      formId: z.string().min(1),
      website: z.string().optional(),
    }),
    handler: async (raw): Promise<SubmitFormResult> => {
      if (raw.website && raw.website.trim() !== "") {
        return { ok: true };
      }

      const formEntry = await getFormByFormId(raw.formId);
      if (!formEntry) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Unknown form.",
        });
      }

      const schema = buildFormInputSchema(formEntry.data.fields);
      const parsed = schema.safeParse(raw);
      if (!parsed.success) {
        return {
          ok: false,
          fieldErrors: z.flattenError(parsed.error).fieldErrors as FieldErrors,
        };
      }

      const resend = new Resend(RESEND_API_KEY);
      const { subject, html, text } = formatSubmissionEmail(
        formEntry.data,
        parsed.data,
      );

      const sendResult = await resend.emails.send({
        from: RESEND_FROM_ADDRESS,
        to: RESEND_TO_ADDRESS,
        subject,
        html,
        text,
      });

      if (sendResult.error) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send email.",
        });
      }

      return { ok: true };
    },
  }),
};
