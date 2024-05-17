export const styleVariants = ["primary", "secondary", "tertiary"] as const;

export type StyleVariant = (typeof styleVariants)[number];
export type StyleVariantClassListMap = Record<StyleVariant, Array<string>>;
