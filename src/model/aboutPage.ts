import { z } from "zod";
import groq from "groq";
import { zPortableText } from "./portableText";
import { gPersonProjection, zPerson } from "./person";

export const gAboutPageQuery = groq`
*[_id == "aboutPage-singleton"][0]{
  ourStory,
  creators[]->{
    ${gPersonProjection}
  },
  teamIntro,
  teamMembers[]->{
    ${gPersonProjection}
  },
}
`;

export const zAboutPage = z.object({
  ourStory: zPortableText,
  teamIntro: zPortableText,
  creators: z.array(zPerson),
  teamMembers: z.array(zPerson),
});

export type AboutPageData = z.infer<typeof zAboutPage>;
