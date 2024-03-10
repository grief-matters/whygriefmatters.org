import {
  type InternetResourcePageListing,
  internetResourceTypes,
} from "@model/internetResource";

export function getFilteredTypesFromResources(
  resources: Array<InternetResourcePageListing>,
) {
  return internetResourceTypes.filter((t) =>
    resources.some((r) => r.type === t),
  );
}
