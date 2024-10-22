import groq from "groq";
import { z } from "zod";
import { zPortableText } from "./portableText";
import { zCategory } from "./category";
import { zPopulation } from "./population";

export const contactMethodTypes = [
  "tel",
  "tty",
  "sms",
  "email",
  "contactForm",
  "liveChat",
] as const;

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const timezones = ["Eastern", "Central", "Mountain", "Pacific"] as const;

const zContactMethodType = z.enum(contactMethodTypes);
const zDay = z.enum(days);
const zTimezone = z.enum(timezones);

const zAvailability = z.object({
  days: z.array(zDay),
  availableFrom: z.string(),
  availableTo: z.string(),
  timezone: zTimezone.nullable(),
});

const zContactMethod = z.discriminatedUnion("contactType", [
  z.object({
    contactType: z.literal("tel"),
    telephoneNumber: z.string(),
    availabilities: z.array(zAvailability).nullable(),
  }),
  z.object({
    contactType: z.literal("tty"),
    telephoneNumber: z.string(),
    availabilities: z.array(zAvailability).nullable(),
  }),
  z.object({
    contactType: z.literal("sms"),
    telephoneNumber: z.string(),
    smsBody: z.string().nullable(),
    availabilities: z.array(zAvailability).nullable(),
  }),
  z.object({
    contactType: z.literal("email"),
    email: z.string(),
  }),
  z.object({
    contactType: z.literal("contactForm"),
    contactForm: z.string().url(),
  }),
  z.object({
    contactType: z.literal("liveChat"),
    liveChatUrl: z.string().url(),
    availabilities: z.array(zAvailability),
  }),
]);

// TODO - this shouldn't all be optional - but it is in the Sanity schema
export const zCrisisResource = z.object({
  title: z.string(),
  description: zPortableText.nullable(),
  resourceUrl: z.string().url().nullable(),
  sourceWebsite: z
    .object({
      name: z.string(),
      resourceUrl: z.string().url(),
    })
    .nullable(),
  populations: z.array(zPopulation.pick({ slug: true, name: true })).nullable(),
  categories: z.array(zCategory).nullable(),
  contactMethods: z.array(zContactMethod),
});

const gAvailabilityProjection = groq`
    days,
    availableFrom,
    availableTo,
    timezone,
`;

export const gCrisisResourcesQuery = groq`
  *[_type == "crisisResource"]{
    "title": name,
    description,
    resourceUrl,
    sourceWebsite->{
      name,
      resourceUrl,
    },
    "populations": populations[]->{
      "slug": slug.current,
      name
      },
    "categories": categories[]->{
      "slug": slug.current,
      title
    },
    "contactMethods": coalesce(contactMethods[]{
      contactType,
      contactType == 'tel' => {
        telephoneNumber,
        "availabilities": coalesce( 
          availabilities[]{
          ${gAvailabilityProjection}
        }
          , [])
      },
      contactType == 'tty' => {
        telephoneNumber,
        "availabilities": coalesce( 
          availabilities[]{
          ${gAvailabilityProjection}
        }
          , [])
      },
      contactType == 'sms' => {
        telephoneNumber,
        smsBody,
        "availabilities": coalesce( 
          availabilities[]{
          ${gAvailabilityProjection}
        }
          , [])
      },
      contactType == 'email' => {
        email
      },
      contactType == 'contactForm' => {
        contactForm
      },
      contactType == 'liveChat' => {
        liveChatUrl,
        "availabilities": coalesce( 
          availabilities[]{
          ${gAvailabilityProjection}
        }
          , [])
      }
    }, [])
  }
`;

export type ContactMethodType = z.infer<typeof zContactMethodType>;
export type ContactMethod = z.infer<typeof zContactMethod>;
export type CrisisResource = z.infer<typeof zCrisisResource>;
export type Availability = z.infer<typeof zAvailability>;
