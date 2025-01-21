import { z } from "zod";
import {
  internetResourceTypes,
  zInternetResourceType,
} from "./internetResource";
import { gContentGroupProjection, zContentGroup } from "./contentGroup";
import groq from "groq";

export const zResourceTypePagesData = z.object({
  commonTemplateData: zContentGroup,
  headPartsByType: z.record(zInternetResourceType, zContentGroup.nullable()),
});

export const gResourceTypePageHeadPartsQuery = `
{
${internetResourceTypes
  .map(
    (t) => `
  "${t}": *[_type == "contentGroup" && slug.current == "${t}"][0]{
    ${gContentGroupProjection}
  }`,
  )
  .join(",\n")}
}
`;

export const gResourceTypePageCommonTemplateQuery = groq`
  *[_type == "contentGroup" && slug.current == $contentSlug][0]{
    ${gContentGroupProjection}
  }
`;

export type ResourceTypePageData = z.infer<typeof zResourceTypePagesData>;

const zResourceTypeCounts = z.record(zInternetResourceType, z.number());
export const zResourceTypeCountsByTopic = z.record(
  z.string(),
  zResourceTypeCounts,
);

const obj = Object.fromEntries(
  internetResourceTypes.map((t) => [t, z.number()]),
);

export const zRawResourceCounts = z
  .object({
    slug: z.string(), // Explicitly define the 'slug' field
  })
  .extend(obj);

export type ResourceTypeCountsByTopic = z.infer<
  typeof zResourceTypeCountsByTopic
>;

export const gResourceTypeCountsByTopicQuery = groq`
*[_type == 'category']{
  "slug": slug.current,
  ${internetResourceTypes
    .map((t) => `"${t}": count(*[_type == '${t}' && references(^._id)])`)
    .join(",\n  ")}
}
`;
