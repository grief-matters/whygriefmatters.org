import type { InternetResourceType } from "@model/internetResource";
import { getHumanReadableStringFromValue } from "./string";

type ResourcePageTitleParams = {
  categoryName?: string;
  populationName?: string;
  resourceType?: InternetResourceType;
};

export type PageTitle = {
  title: string;
  supTitle?: string;
  subTitle?: string;
};

export function getResourcePageTitle(
  params: ResourcePageTitleParams,
): PageTitle {
  const catPart = params.categoryName;
  const popPart = params.populationName;
  const typePart = params.resourceType
    ? getHumanReadableStringFromValue(params.resourceType, true)
    : undefined;

  const title = catPart ?? popPart ?? typePart ?? "Resources";
  const supTitle =
    title === typePart
      ? undefined
      : title === popPart
      ? `${typePart ? typePart : "Resources"} for...`
      : `${typePart ? typePart : "Resources"}${
          popPart ? ` for ${popPart} about...` : ` about...`
        }`;

  return {
    title,
    supTitle,
  };
}
