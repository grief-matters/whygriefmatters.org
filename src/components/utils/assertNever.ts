/**
 * Exhaustive check helper - ensures all cases in a discriminated union are handled.
 * Throws at runtime if called, which indicates a missed case.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}
