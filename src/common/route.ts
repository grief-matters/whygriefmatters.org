import type { ResourcePageLink } from "@model/featuredContent";

export function getRoute(pageLink: ResourcePageLink): string {
  const slugParts = [pageLink.type, pageLink.category, pageLink.population]
    .filter((part) => Boolean(part))
    .join("/");

  return `/${slugParts}`;
}
