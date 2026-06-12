import type { NavTreeNode } from "./navigation-tree";
import type { ResourceTypeCounts } from "./content/shared";

type ResourceCountsMap = Map<string, ResourceTypeCounts>;
type BuildCache = {
  navTrees: Map<string, NavTreeNode[]>;
  resourceTypeCounts: ResourceCountsMap;
  resourceTypeCountsPopulation: ResourceCountsMap;
  resourceExistence: Set<string> | undefined;
};

export const buildCache: BuildCache = {
  navTrees: new Map<string, NavTreeNode[]>(),
  resourceTypeCounts: new Map<string, ResourceTypeCounts>(),
  resourceTypeCountsPopulation: new Map<string, ResourceTypeCounts>(),
  resourceExistence: undefined,
};
