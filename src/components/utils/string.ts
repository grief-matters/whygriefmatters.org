import { zNonEmptyString } from "@content/model/utils";

/** Type guard that checks if a value is a non-empty string. */
export function isNonEmptyString(input: unknown): input is string {
  const parsed = zNonEmptyString.safeParse(input);
  return parsed.success;
}
