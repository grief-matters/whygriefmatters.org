import type { InternetResourceType } from "@model/common";

export const cvaSchemaStandardVariants = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
] as const;

export type StandardStyleVariant = (typeof cvaSchemaStandardVariants)[number];

export type StandardVariantCvaSchema = {
  variant: Record<StandardStyleVariant, Array<string>>;
};

export type ResourceTypeVariantCvaSchema = {
  variant: Record<InternetResourceType | "default", Array<string>>;
};
