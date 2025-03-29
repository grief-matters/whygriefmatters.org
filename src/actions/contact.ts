import Mailgun from "mailgun.js";

import {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  MAILGUN_FROM,
  MAILGUN_TO,
} from "astro:env/server";
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
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: MAILGUN_API_KEY,
    });

    try {
      // todo - save response to a database/crm platform
      await mg.messages.create(MAILGUN_DOMAIN, {
        from: MAILGUN_FROM,
        to: [MAILGUN_TO],
        subject: "Contact Form Submission",
        text: getEmailContent(input),
      });

      console.log("Message Send Successful...");
    } catch (error) {
      // todo - handle system errors
      console.log("Went wrong with...");
      console.log(
        "API Key is defined: ",
        typeof MAILGUN_API_KEY !== "undefined",
      );
      console.log("MAILGUN_DOMAIN", MAILGUN_DOMAIN);
      console.log("MAILGUN_FROM", MAILGUN_FROM);
      console.log("MAILGUN_TO", MAILGUN_TO);
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
