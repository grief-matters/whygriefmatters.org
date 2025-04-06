import { Resend } from "resend";

import {
  RESEND_API_KEY,
  RESEND_FROM_ADDRESS,
  RESEND_TO_ADDRESS,
} from "astro:env/server";
import { ActionError, defineAction } from "astro:actions";
import { zContactInput, type ContactInput } from "@model/contactFormInput";

const resend = new Resend(RESEND_API_KEY);

export const contact = defineAction({
  input: zContactInput,
  handler: async (input) => {
    if ((input.referralSource ?? "").length > 0) {
      // Honeypot field was completed - exit quietly
      return;
    }

    const { error } = await resend.emails.send({
      from: RESEND_FROM_ADDRESS,
      to: [RESEND_TO_ADDRESS],
      subject: "Contact Form Submission",
      text: getEmailContent(input),
    });

    if (error) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: error.message,
      });
    }

    return;
  },
});

const getEmailContent = (input: ContactInput) => `
-- This is a system generated email - Please do not reply --\n
We have had the following submission via our website contact form:\n
Name: ${input.name}
Email: ${input.email}
Message:
---\n
${input.message}\n
---
End of message`;
