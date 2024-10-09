import { z } from "zod";
import groq from "groq";

import { zPortableText } from "./portableText";
import { zImage } from "./image";
import { gContentGroupProjection, zContentGroup } from "./contentGroup";

export const zHomePageData = z.object({
  org: z.object({
    name: z.string(),
    slogan: z.string(),
    mission: zPortableText,
    coreValues: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
    logo: zImage,
  }),
  heroImage: zImage,
  featurePanels: z.array(zContentGroup),
});

export const gHomePageDataQuery = groq`
*[_id == "homePage-singleton"][0]{
  "org": *[_id == "organization-singleton"][0]{
    name,
    slogan,
    mission,
    coreValues[]{
      "title": value,
      description
    },
    "logo": logos[variant == 'light-secondary'][0]{
      ...logo{
        image,
        "altText": alt,
      }
    }
  },
  "heroImage": {
    "image": heroImage.image,
    "altText": heroImage.alt, 
  },
  featurePanels[]->{
    ${gContentGroupProjection}
  }
}
`;

export type HomePageData = z.infer<typeof zHomePageData>;
