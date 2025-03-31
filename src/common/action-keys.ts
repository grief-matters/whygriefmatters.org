export type ActionKey = (typeof actionKeys)[number];

export const actionKeys = ["contact"] as const;

export function isActionKey(value: unknown): value is ActionKey {
  return actionKeys.includes(value as ActionKey);
}
