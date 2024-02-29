import { INTERNET_RESOURCE_TYPES } from "@model/common";
import type { InternetResource } from "@model/internetResource";

export function filterTypesFromResources(resources: Array<InternetResource>) {
  return INTERNET_RESOURCE_TYPES.filter((t) =>
    resources.some((r) => r.type === t),
  );
}
