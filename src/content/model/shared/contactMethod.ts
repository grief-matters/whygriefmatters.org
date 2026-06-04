import { z } from "astro/zod";

export const zAvailability = z.object({
  days: z.array(z.string()).nullable(),
  availableFrom: z.string().nullable(),
  availableTo: z.string().nullable(),
  timezone: z.string().nullable(),
});

export const zContactMethod = z.object({
  contactType: z.enum([
    "email",
    "contactForm",
    "tel",
    "tty",
    "sms",
    "liveChat",
  ]),
  telephoneNumber: z.string().nullable(),
  smsBody: z.string().nullable(),
  email: z.string().nullable(),
  contactForm: z.string().nullable(),
  liveChatUrl: z.string().nullable(),
  availabilities: z.array(zAvailability).nullable(),
});

export type Availability = z.infer<typeof zAvailability>;
export type ContactMethod = z.infer<typeof zContactMethod>;
