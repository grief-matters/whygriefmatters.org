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
    console.log("not implemented. processing: ", input);
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
