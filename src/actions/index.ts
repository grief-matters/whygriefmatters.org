import { defineAction } from "astro:actions";
import { evaluation } from "./evaluation";
import { z } from "astro:schema";

export const server = {
  evaluation,
  getGreeting: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
    }),
    handler: async (input) => {
      console.log(input);
      return `Hello, ${input.name}!`;
    },
  }),
};
