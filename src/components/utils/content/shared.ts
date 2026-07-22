import { type InternetResourceCollectionKey } from "@content/collections";

/** A partial record of resource collection keys to their counts. */
export type ResourceTypeCounts = Partial<
  Record<InternetResourceCollectionKey, number>
>;
