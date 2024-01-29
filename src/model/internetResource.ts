import groq from "groq";
import { z } from "zod";
import { zImage, zInternetResourceType } from "./common";

export const zInternetResource = z.object({
  type: zInternetResourceType,
  title: z.string(),
  description: z.string().nullable(),
  resourceUrl: z.string().url(),
  sourceWebsite: z
    .object({
      name: z.string(),
      directlyQuoted: z.boolean().nullable(),
      resourceUrl: z.string().url(),
    })
    .nullable(),
});

export type InternetResource = z.infer<typeof zInternetResource>;

export const zArticle = zInternetResource.extend({
  image: zImage.nullable(),
});

export type Article = z.infer<typeof zArticle>;

export const zStory = zInternetResource.extend({
  image: zImage.nullable(),
});

export type Story = z.infer<typeof zStory>;

export const resourceQuery = (filter: string) => groq`
*[${filter}]
  {
    "type": _type,
    "title": coalesce(title, name),
    description,
    resourceUrl,
    sourceWebsite->{
      name,
      directlyQuoted,
      resourceUrl,
    },  
  }
`;

export type GetInternetResourcesQueryParams = {
  resourceType?: string;
  categorySlug?: string;
  populationSlug?: string;
} & (
  | { resourceType: string }
  | { categorySlug: string }
  | { populationSlug: string }
);

const internetResourceQueryParts: Record<
  keyof GetInternetResourcesQueryParams,
  string
> = {
  resourceType: `_type == $type`,
  categorySlug: `$categorySlug in categories[]->slug.current`,
  populationSlug: `$populationSlug in populations[]->slug.current`,
};

export function getInternetResourceQuery(
  params: GetInternetResourcesQueryParams,
) {
  const queryFilter = Object.keys(params)
    .map(
      (k) =>
        internetResourceQueryParts[k as keyof GetInternetResourcesQueryParams],
    )
    .join(" && ");

  return resourceQuery(queryFilter);
}
