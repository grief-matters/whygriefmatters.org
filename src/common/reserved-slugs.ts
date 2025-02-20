import { internetResourceTypes } from "@model/internetResource";

export const templatingSlugs = {
  exploreByTopicBlocksPart: "explore-by-topic-topic-blocks-part",
} as const;

// TODO - we should really have our slugs for resource type be kebab-case
export const reservedSlugs: readonly string[] = [
  ...internetResourceTypes,
  ...Object.values(templatingSlugs),
  "contribute",
  "donate",
] as const;

export function isReservedSlug(
  slug: string,
): slug is (typeof reservedSlugs)[number] {
  return reservedSlugs.includes(slug as (typeof reservedSlugs)[number]);
}
