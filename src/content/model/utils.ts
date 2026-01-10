import { z } from "astro:content";

/**
 * Create a Zod schema for a pre-existing Type
 */
export const zSchemaForType =
  <T>() =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

export const zNonEmptyString = z.string().trim().min(1);
