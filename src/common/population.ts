import type { InternetResource } from "@model/internetResource";
import { getPopulations } from "./client";

export async function getFilteredPopulationsFromResources(
  resources: Array<InternetResource>,
) {
  const populations = await getPopulations();

  return populations.filter((p) =>
    resources.some((r) => r.populations?.includes(p.slug)),
  );
}
