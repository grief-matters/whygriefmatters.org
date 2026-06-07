import { getEntries, type CollectionEntry } from "astro:content";
import kebabCase from "lodash/kebabCase";

import type { InternetResourceCollectionKey } from "@content/collections";

const TAXONOMY_FIELDS = [
  "lossRelationships",
  "causesOfDeath",
  "themes",
  "demographics",
  "griefPhases",
  "griefTypes",
  "contentFunctions",
  "emotionalStates",
] as const;

const ENUM_FIELDS = ["audienceRole", "supportedGriever"] as const;

export async function getResourceFilterAttrs(
  entry: CollectionEntry<InternetResourceCollectionKey>,
): Promise<Record<string, string>> {
  const attrs: Record<string, string> = {
    "data-resource-media-type": kebabCase(entry.collection),
  };

  for (const field of TAXONOMY_FIELDS) {
    if (!(field in entry.data)) continue;
    const refs = (
      entry.data as unknown as Record<
        string,
        Array<{ collection: string; id: string }>
      >
    )[field];
    if (!refs || refs.length === 0) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolved = await getEntries(refs as any);
    const slugs: string[] = [];
    for (const r of resolved) {
      const data = r?.data as unknown as { slug?: unknown } | undefined;
      if (data && typeof data.slug === "string") slugs.push(data.slug);
    }
    if (slugs.length === 0) continue;
    attrs[`data-resource-${kebabCase(field)}`] = slugs.join(",");
  }

  for (const field of ENUM_FIELDS) {
    if (!(field in entry.data)) continue;
    const values = (
      entry.data as unknown as Record<string, Array<string> | null>
    )[field];
    if (!values || values.length === 0) continue;
    attrs[`data-resource-${kebabCase(field)}`] = values.join(",");
  }

  return attrs;
}
