const tailwindBreakpoints = ["sm", "md", "lg", "xl", "2xl"] as const;
export type TailwindBreakpoint = (typeof tailwindBreakpoints)[number];
export type TailwindBreapointToPixelWidthMap = Record<
  TailwindBreakpoint,
  number
>;

export const tailwindBreapointToPixelWidthMap: TailwindBreapointToPixelWidthMap =
  {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };
