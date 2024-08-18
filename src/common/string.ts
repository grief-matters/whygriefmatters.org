import startCase from "lodash/startCase";
import words from "lodash/words";
import libPluralize from "pluralize";

/**
 * Return a human readable version of a string value
 * @param value
 * @param pluralize
 * @returns
 */
export function getHumanReadableStringFromValue(
  value: string,
  pluralize?: boolean,
) {
  return pluralize ? libPluralize(startCase(value)) : startCase(value);
}
