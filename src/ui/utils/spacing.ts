export const spaceSettingKeys = [1, 2, 3, 4, 5, 6, 7] as const;
export type SpaceSetting = (typeof spaceSettingKeys)[number];

/**
 * Spacing reference Figma to Tailwind
 * tailwind spacing value = 0.25rem (4px)
 * [num] * 4
 */

export const paddingYSettingMap: Record<SpaceSetting, string> = {
  1: "py-1.5",
  2: "py-3",
  3: "py-4",
  4: "py-6",
  5: "py-8",
  6: "py-12",
  7: "py-16",
};

export const paddingXSettingMap: Record<SpaceSetting, string> = {
  1: "px-1.5",
  2: "px-3",
  3: "px-4",
  4: "px-6",
  5: "px-8",
  6: "px-12",
  7: "px-16",
};

export const paddingSettingMap: Record<SpaceSetting, string> = {
  1: "p-1.5",
  2: "p-3",
  3: "p-4",
  4: "p-6",
  5: "p-8",
  6: "p-12",
  7: "p-16",
};

export const marginSettingMap: Record<SpaceSetting, string> = {
  1: "m-1.5",
  2: "m-3",
  3: "m-4",
  4: "m-6",
  5: "m-8",
  6: "m-12",
  7: "m-16",
};

export const paddingBottomMap: Record<SpaceSetting, string> = {
  1: "pb-1.5",
  2: "pb-3",
  3: "pb-4",
  4: "pb-6",
  5: "pb-8",
  6: "pb-12",
  7: "pb-16",
};

export const marginBottomMap: Record<SpaceSetting, string> = {
  1: "mb-1.5",
  2: "mb-3",
  3: "mb-4",
  4: "mb-6",
  5: "mb-8",
  6: "mb-12",
  7: "mb-16",
};
