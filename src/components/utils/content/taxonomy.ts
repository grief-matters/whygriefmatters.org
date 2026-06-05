export const TAXONOMY_FILTER_CONFIGS = [
  { key: "lossRelationships", label: "Loss Relationship" },
  { key: "themes", label: "Theme" },
  { key: "demographics", label: "Demographic" },
  { key: "griefPhases", label: "Grief Phase" },
  { key: "griefTypes", label: "Grief Type" },
  { key: "contentFunctions", label: "Content Function" },
  { key: "emotionalStates", label: "Emotional State" },
] as const;

export type TaxonomyFilterKey = (typeof TAXONOMY_FILTER_CONFIGS)[number]["key"];
