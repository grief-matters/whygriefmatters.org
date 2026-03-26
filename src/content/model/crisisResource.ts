import { reference, z } from "astro:content";
import { zSanityImage } from "./image";
import { zPortableText } from "./portableText";

const zAvailability = z.object({
  days: z.array(z.string()).nullable(),
  availableFrom: z.string().nullable(),
  availableTo: z.string().nullable(),
  timezone: z.string().nullable(),
});

const zContactMethod = z.object({
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

export const zCrisisResource = z.object({
  id: z.string(),
  updatedAt: z.string().datetime(),
  title: z.string(),
  description: zPortableText.nullable(),
  resourceUrl: z.string().url().nullable(),
  sourceWebsiteId: z.string().nullable(),
  categories: z.array(reference("categories")),
  populations: z.array(reference("populations")),
  logo: zSanityImage.nullable(),
  languages: z.array(z.string()).nullable(),
  contactMethods: z.array(zContactMethod).nullable(),
});

export type CrisisResource = z.infer<typeof zCrisisResource>;
export type ContactMethod = NonNullable<
  CrisisResource["contactMethods"]
>[number];
export type Availability = NonNullable<ContactMethod["availabilities"]>[number];
