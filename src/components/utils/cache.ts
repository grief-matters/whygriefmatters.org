import type { CategoryTreeNode } from "./content/category";
import type { ResourceTypeCounts } from "./content/shared";

type ResourceCountsMap = Map<string, ResourceTypeCounts>;
type BuildCache = {
  navTree: CategoryTreeNode[] | undefined;
  resourceTypeCounts: ResourceCountsMap;
  resourceTypeCountsPopulation: ResourceCountsMap;
  resourceExistence: Set<string> | undefined;
};

export const buildCache: BuildCache = {
  navTree: undefined,
  resourceTypeCounts: new Map<string, ResourceTypeCounts>(),
  resourceTypeCountsPopulation: new Map<string, ResourceTypeCounts>(),
  resourceExistence: undefined,
};
