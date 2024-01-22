import groq from "groq";
import { z } from "zod";

export const zInternetResource = z.object({
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

export const resourceQuery = (filter: string) => groq`
*[${filter}]
  {
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
  category?: string;
  population?: string;
} & ({ resourceType: string } | { category: string } | { population: string });

const internetResourceQueryParts: Record<
  keyof GetInternetResourcesQueryParams,
  string
> = {
  resourceType: `_type == $type`,
  category: `$category in categories[]->slug.current`,
  population: `$population in populations[]->slug.current`,
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
