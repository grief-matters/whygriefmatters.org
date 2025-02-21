export type StylableTextBlockElement =
  (typeof stylableTextBlockElements)[number];

export const stylableTextBlockElements = ["p", "em", "strong"] as const;

export const baseClassLists: Record<StylableTextBlockElement, Array<string>> = {
  em: ["italic"],
  strong: ["font-medium"],
  p: ["mb-4 leading-relaxed"],
};

const variantClassLists: Record<
  "default" | "contrast",
  Record<StylableTextBlockElement, Array<string>>
> = {
  default: {
    p: ["text-sky-900"],
    em: ["text-sky-700/75"],
    strong: ["text-sky-700/75"],
  },
  contrast: {
    p: ["text-stone-50"],
    em: [""],
    strong: [""],
  },
};

type StylableElementResetMap = Partial<
  Record<StylableTextBlockElement, boolean>
>;

type StylableElementClassListsMap = Partial<
  Record<StylableTextBlockElement, Array<string>>
>;

export interface BaseTextBlockProps {
  variant?: "default" | "contrast";
  resetBaseClassLists?: StylableElementResetMap;
  stylableElementClassLists?: StylableElementClassListsMap;
}

export const getTextBlockClassList = (
  el: StylableTextBlockElement,
  resetBase?: boolean,
  classList?: Array<string>,
  variant?: "default" | "contrast",
) =>
  [
    ...(resetBase ? [] : baseClassLists[el]),
    ...variantClassLists?.[variant ?? "default"]?.[el],
    ...(classList ?? []),
  ].join(" ");
