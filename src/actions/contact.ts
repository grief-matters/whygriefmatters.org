import { Resend } from "resend";

import {
  RESEND_API_KEY,
  RESEND_FROM_ADDRESS,
  RESEND_TO_ADDRESS,
} from "astro:env/server";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

const zContactInput = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type ContactInput = z.infer<typeof zContactInput>;

const resend = new Resend(RESEND_API_KEY);

export const contact = defineAction({
  accept: "form",
  input: zContactInput,
  handler: async (input) => {
    const { data, error } = await resend.emails.send({
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

    return data;
  },
});

const getEmailContent = (input: ContactInput) => `
-- This is a system generated email --\n
We have had the following submission via our website contact form:\n
Name: ${input.name}
Email: ${input.email}
Message:
---
${input.message}\n
---
End of message`;
