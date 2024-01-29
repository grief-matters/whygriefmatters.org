import { z } from "zod";
import groq from "groq";
import { zImage, zPortableText } from "./common";
import { zFeaturedContent } from "./featuredContent";

export const zHomePage = z.object({
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
  featurePanels: z.array(zFeaturedContent),
});

export type HomePage = z.infer<typeof zHomePage>;

export const homePageQuery = groq`
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
    title,
    description,
    content[]{
      _type == "richTextContentBlock" => {
        "contentType": _type,
        portableText
      },
      _type == "rowOfThree" => {
        "contentType": _type,
        images[]{
          image,
          "altText": alt
        }
      },
      _type == "resourcePageLinks" => {
        "contentType": _type,
        links[]{
          label,
          type,
          "category": category -> slug.current,
          "population": population -> slug.current
        },
      },
      _type == "resourceLinks" => {
        "contentType": _type,
        resources[]->{
          "title": coalesce(title, name),
          "url": resourceUrl
        }
      }
    },
    featuredContentFooterLink {
      label,
      type,
      "population": population->slug.current,
      "category": category->slug.current
      }
    }
  }
`;
