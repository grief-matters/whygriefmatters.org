import type { CollectionEntry } from "astro:content";
import { kebabCase, startCase } from "lodash";

import {
  internetResourceCollectionKeys,
  type InternetResourceCollectionKey,
} from "@content/collections";
import type { ResourceIndex } from "@content/utils/resourceIndex";
import {
  TAXONOMY_FILTER_CONFIGS,
  type TaxonomyFilterKey,
  type TaxonomyPageKey,
} from "@content/utils/taxonomy";

export interface FilterOption {
  value: string;
  label: string;
}

export type FilterGroupKey =
  | TaxonomyFilterKey
  | "mediaType"
  | "audienceRole"
  | "supportedGriever";

export interface FilterGroup {
  key: FilterGroupKey;
  label: string;
  options: Array<FilterOption>;
}

const ENUM_FILTER_CONFIGS = [
  { key: "audienceRole" as const, label: "Audience" },
  { key: "supportedGriever" as const, label: "Supporting" },
];

export const CORE_FILTER_KEYS = new Set<FilterGroupKey>([
  "causesOfDeath",
  "lossRelationships",
  "themes",
  "demographics",
]);

interface BuildFilterGroupsArgs {
  displayedResources: Array<CollectionEntry<InternetResourceCollectionKey>>;
  index: ResourceIndex;
  excludeCollection?: TaxonomyPageKey;
}

export function buildFilterGroups({
  displayedResources,
  index,
  excludeCollection,
}: BuildFilterGroupsArgs): Array<FilterGroup> {
  const filterGroups: Array<FilterGroup> = [];

  for (const config of TAXONOMY_FILTER_CONFIGS) {
    if (excludeCollection && config.key === excludeCollection) {
      continue;
    }

    const referencedIds = new Set<string>();
    for (const resource of displayedResources) {
      if (!(config.key in resource.data)) {
        continue;
      }
      const refs = (
        resource.data as unknown as Record<string, Array<{ id: string }>>
      )[config.key];
      for (const ref of refs) {
        referencedIds.add(ref.id);
      }
    }
    if (referencedIds.size === 0) {
      continue;
    }

    const options: Array<FilterOption> = [];
    for (const id of referencedIds) {
      const taxonomyEntry = index.taxonomyEntriesById.get(id);
      if (!taxonomyEntry) {
        continue;
      }
      options.push({
        value: taxonomyEntry.data.slug,
        label: taxonomyEntry.data.title,
      });
    }
    if (options.length === 0) {
      continue;
    }
    filterGroups.push({ key: config.key, label: config.label, options });
  }

  const presentCollectionKeys = new Set(
    displayedResources.map((r) => r.collection),
  );

  for (const config of ENUM_FILTER_CONFIGS) {
    const present = new Set<string>();
    for (const resource of displayedResources) {
      const values = (
        resource.data as unknown as Record<string, Array<string> | null>
      )[config.key];
      if (!values) {
        continue;
      }
      for (const v of values) {
        present.add(v);
      }
    }
    if (present.size === 0) {
      continue;
    }
    filterGroups.push({
      key: config.key,
      label: config.label,
      options: [...present].map((v) => ({ value: v, label: startCase(v) })),
    });
  }

  const mediaTypeOptions: Array<FilterOption> = [];
  for (const collectionKey of internetResourceCollectionKeys) {
    if (!presentCollectionKeys.has(collectionKey)) {
      continue;
    }
    mediaTypeOptions.push({
      value: kebabCase(collectionKey),
      label: startCase(collectionKey),
    });
  }
  if (mediaTypeOptions.length > 0) {
    filterGroups.push({
      key: "mediaType",
      label: "Media Type",
      options: mediaTypeOptions,
    });
  }

  return filterGroups;
}
