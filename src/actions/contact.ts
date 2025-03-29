import { Resend } from "resend";

import { RESEND_API_KEY } from "astro:env/server";
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
  handler: async () => {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["danlechambre@icloud.com"],
      subject: "Hello world",
      html: "<strong>It works!</strong>",
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
