import type { DynamicResourcePageLink } from "@model/contentBlock";
import type { InternetResourceType } from "@model/internetResource";

export type TopicFilter = {
  resourceType: InternetResourceType;
  population: string; // not sure about pop yet
};

export type ResourcePageLinkParams = {
  resourceType?: InternetResourceType;
  population?: string;
  topic?: string;
};

export function getRouteFromDynamicResourcePageLink(
  pageLink: Omit<DynamicResourcePageLink, "label">,
): string {
  const slugParts = [pageLink.type, pageLink.category, pageLink.population]
    .filter((part) => Boolean(part))
    .join("/");

  return `/${slugParts}`;
}

export function getRouteFromResourcePageLinkParams(
  pageLinkParams: ResourcePageLinkParams,
): string {
  const linkParts = [
    pageLinkParams.resourceType,
    pageLinkParams.topic,
    pageLinkParams.population,
  ];

  return linkParts.filter((part) => Boolean(part)).join("/");
}
