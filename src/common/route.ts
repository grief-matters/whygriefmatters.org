import type { ResourcePageLink } from "@model/contentBlock";

export function getRoute(pageLink: Omit<ResourcePageLink, "label">): string {
  const slugParts = [pageLink.type, pageLink.category, pageLink.population]
    .filter((part) => Boolean(part))
    .join("/");

  return `/${slugParts}`;
}
