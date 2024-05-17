import { type InternetResourcePageListing } from "@model/internetResource";
import uniq from "lodash/uniq";

/**
 * Given a set of resources - return an array of the applicable resource types
 * @param resources
 * @returns
 */
export function getFilteredTypesFromResources(
  resources: Array<InternetResourcePageListing>,
) {
  return uniq(resources.map((r) => r.type));
}
