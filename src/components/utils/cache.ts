import type { NavTreeNode } from "./main-nav";
import type { ResourceTypeCounts } from "./content/shared";

type ResourceCountsMap = Map<string, ResourceTypeCounts>;
type BuildCache = {
  mainNav: NavTreeNode[] | undefined;
  resourceTypeCounts: ResourceCountsMap;
  resourceTypeCountsPopulation: ResourceCountsMap;
  resourceExistence: Set<string> | undefined;
};

export const buildCache: BuildCache = {
  mainNav: undefined,
  resourceTypeCounts: new Map<string, ResourceTypeCounts>(),
  resourceTypeCountsPopulation: new Map<string, ResourceTypeCounts>(),
  resourceExistence: undefined,
};
