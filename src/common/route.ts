import type { DynamicResourcePageLink } from "@model/contentBlock";

export function getRouteFromDynamicResourcePageLink(
  pageLink: Omit<DynamicResourcePageLink, "label">,
): string {
  const slugParts = [pageLink.type, pageLink.category, pageLink.population]
    .filter((part) => Boolean(part))
    .join("/");

  return `/${slugParts}`;
}
