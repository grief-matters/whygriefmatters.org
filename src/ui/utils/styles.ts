export const textPresets = [
  "title-1",
  "title-2",
  "title-3",
  "title-4",
  "body-2",
  "body-1",
  "subtitle-1",
] as const;

export const textPresetClassMap: Record<TextPreset, string> = {
  "title-1": "font-serif font-bold text-4xl",
  "title-2": "font-serif font-bold text-3xl",
  "title-3": "font-serif font-bold text-2xl",
  "title-4": "font-serif font-bold text-xl",
  "body-2": "font-serif font-normal text-lg",
  "body-1": "font-serif font-normal text-base",
  "subtitle-1": "font-sans-b font-normal text-sm",
} as const;

export const colorVariants = [
  "neutral",
  "primary",
  "secondary",
  "tertiary",
  "primaryContrast",
] as const;
export type ColorVariant = (typeof colorVariants)[number];

export type SurfaceColorVariant = ColorVariant;

export type OnSurfaceColorVariant =
  | "coolNeutral"
  | "warmNeutral"
  | "primary"
  | "secondary"
  | "tertiary"
  | "primaryContrast";

export type Prominence = "default" | "muted" | "prominent";
export type ProminenceMap = Record<Prominence, string>;
export type TextPreset = (typeof textPresets)[number];

type TextProminenceMap = Record<TextProminence, string>;

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

export type TextProminence = Exclude<Prominence, "prominent">;

export type PaddingSetting = 1 | 2 | 3;

export const paddingYSettingMap: Record<PaddingSetting, string> = {
  1: "py-3",
  2: "py-5",
  3: "py-8",
};

export const paddingXSettingMap: Record<PaddingSetting, string> = {
  1: "px-3",
  2: "",
  3: "",
};
