export const spaceSettingKeys = [1, 2, 3, 4, 5, 6, 7] as const;
export type SpaceSetting = (typeof spaceSettingKeys)[number];

/**
 * Spacing reference Figma to Tailwind
 * tailwind spacing value = 0.25rem (4px)
 * [num] * 4
 */

const spacingValues: Record<SpaceSetting, string> = {
  1: "1.5",
  2: "3",
  3: "4",
  4: "6",
  5: "8",
  6: "12",
  7: "16",
};

function buildMap(prefix: string): Record<SpaceSetting, string> {
  return Object.fromEntries(
    spaceSettingKeys.map((k) => [k, `${prefix}-${spacingValues[k]}`]),
  ) as Record<SpaceSetting, string>;
}

export const paddingYSettingMap = buildMap("py");
export const paddingXSettingMap = buildMap("px");
export const paddingSettingMap = buildMap("p");
export const marginSettingMap = buildMap("m");
export const paddingBottomMap = buildMap("pb");
export const marginBottomMap = buildMap("mb");
export const gapMap = buildMap("gap");
export const spaceYMap = buildMap("space-y");
