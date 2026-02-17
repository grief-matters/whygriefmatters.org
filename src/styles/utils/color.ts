import type { ProminenceClassListMap } from "./shared";
import type { TextProminenceMap } from "./typography";

export type ColorVariant = (typeof colorVariants)[number];

export type LayoutSurfaceVariantKey = 1 | 2 | 3 | 4;
export type SurfaceColorVariant = ColorVariant;
export type OnSurfaceColorVariant =
  | "coolNeutral"
  | "warmNeutral"
  | "primary"
  | "secondary"
  | "tertiary"
  | "primaryContrast";

export const standardVariantsClassMap: Record<
  SurfaceColorVariant,
  ProminenceClassListMap
> = {
  neutral: {
    default: [
      "bg-contentSurface-neutral--default",
      "border border-line-neutral--default",
    ],
    muted: [
      "bg-contentSurface-neutral--muted",
      "border border-line-neutral--muted",
    ],
    prominent: [
      "bg-contentSurface-neutral--prominent",
      "border border-line-neutral--prominent",
    ],
  },
  primary: {
    default: [
      "bg-contentSurface-primary--default",
      "border border-line-primary--default",
    ],
    muted: [
      "bg-contentSurface-primary--muted",
      "border border-line-primary--muted",
    ],
    prominent: [
      "bg-contentSurface-primary--prominent",
      "border border-line-primary--prominent",
    ],
  },
  secondary: {
    default: [
      "bg-contentSurface-secondary--default",
      "border border-line-secondary--default",
    ],
    muted: [
      "bg-contentSurface-secondary--muted",
      "border border-line-secondary--muted",
    ],
    prominent: [
      "bg-contentSurface-secondary--prominent",
      "border border-line-secondary--prominent",
    ],
  },
  tertiary: {
    default: [
      "bg-contentSurface-tertiary--default",
      "border border-line-tertiary--default",
    ],
    muted: [
      "bg-contentSurface-tertiary--muted",
      "border border-line-tertiary--muted",
    ],
    prominent: [
      "bg-contentSurface-tertiary--prominent",
      "border border-line-tertiary--prominent",
    ],
  },
  primaryContrast: {
    default: ["bg-contentSurface-primaryContrast--default"],
    muted: ["bg-contentSurface-primaryContrast--muted"],
    prominent: ["bg-contentSurface-primaryContrast--prominent"],
  },
};

export const colorVariants = [
  "neutral",
  "primary",
  "secondary",
  "tertiary",
  "primaryContrast",
] as const;

export const textColorMap: Record<OnSurfaceColorVariant, TextProminenceMap> = {
  coolNeutral: {
    default: "text-onSurface-coolNeutral--default",
    muted: "text-onSurface-coolNeutral--muted",
  },
  warmNeutral: {
    default: "text-onSurface-warmNeutral--default",
    muted: "text-onSurface-warmNeutral--muted",
  },
  primary: {
    default: "text-onSurface-primary--default",
    muted: "text-onSurface-primary--muted",
  },
  primaryContrast: {
    default: "text-onSurface-primaryContrast--default",
    muted: "text-onSurface-primaryContrast--muted",
  },
  secondary: {
    default: "text-onSurface-secondary--default",
    muted: "text-onSurface-secondary--muted",
  },
  tertiary: {
    default: "text-onSurface-tertiary--default",
    muted: "text-onSurface-tertiary--muted",
  },
};
