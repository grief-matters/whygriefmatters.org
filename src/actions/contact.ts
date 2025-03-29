import Mailgun from "mailgun.js";

import { defineAction } from "astro:actions";
import { z } from "astro:schema";

const zContactInput = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type ContactInput = z.infer<typeof zContactInput>;

export const contact = defineAction({
  accept: "form",
  input: zContactInput,
  handler: async (input) => {
    if (
      typeof process.env.MAILGUN_API_KEY === "undefined" ||
      typeof process.env.MAILGUN_DOMAIN === "undefined" ||
      typeof process.env.MAILGUN_FROM === "undefined" ||
      typeof process.env.MAILGUN_TO === "undefined"
    ) {
      // todo - handle
      const valueTable = [
        ["MAILGUN_API_KEY", typeof process.env.MAILGUN_API_KEY],
        ["MAILGUN_DOMAIN", process.env.MAILGUN_DOMAIN],
        ["MAILGUN_FROM", process.env.MAILGUN_FROM],
        ["MAILGUN_TO", process.env.MAILGUN_TO],
      ];

      console.error(".env value undefined");
      console.table(valueTable);
      return;
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    });

    try {
      // todo - save response to a database/crm platform
      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.MAILGUN_FROM,
        to: [process.env.MAILGUN_TO],
        subject: "Contact Form Submission",
        text: getEmailContent(input),
      });

      console.log("Message Send Successful...");
    } catch (error) {
      // todo - handle system errors
      console.error(error); //logs any error
    }
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
