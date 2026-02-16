export const textPresets = [
  "title-1",
  "title-2",
  "title-3",
  "title-4",
  "title-5",
  "body-2",
  "body-small",
  "body-1",
  "subtitle-1",
  "button-1",
  "button-2",
] as const;

interface TextPresetDefinition {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
}

export const textPresetMap: Record<TextPreset, TextPresetDefinition> = {
  "title-1": { fontFamily: "font-serif", fontSize: "text-4xl", fontWeight: "font-bold" },
  "title-2": { fontFamily: "font-serif", fontSize: "text-3xl", fontWeight: "font-bold" },
  "title-3": { fontFamily: "font-serif", fontSize: "text-2xl", fontWeight: "font-bold" },
  "title-4": { fontFamily: "font-serif", fontSize: "text-xl", fontWeight: "font-bold" },
  "title-5": { fontFamily: "font-serif", fontSize: "text-lg", fontWeight: "font-bold" },
  "body-2": { fontFamily: "font-serif", fontSize: "text-lg", fontWeight: "font-normal" },
  "body-1": { fontFamily: "font-serif", fontSize: "text-base", fontWeight: "font-normal" },
  "body-small": { fontFamily: "font-serif", fontSize: "text-sm", fontWeight: "font-normal" },
  "subtitle-1": { fontFamily: "font-sans-b", fontSize: "text-sm", fontWeight: "font-normal" },
  "button-1": { fontFamily: "font-sans-a", fontSize: "text-base", fontWeight: "font-bold" },
  "button-2": { fontFamily: "font-serif", fontSize: "text-base", fontWeight: "font-bold" },
};

export const textPresetClassMap: Record<TextPreset, string> = Object.fromEntries(
  Object.entries(textPresetMap).map(([key, { fontFamily, fontSize, fontWeight }]) => [
    key,
    `${fontFamily} ${fontWeight} ${fontSize}`,
  ]),
) as Record<TextPreset, string>;

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
