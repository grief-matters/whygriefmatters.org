import { z } from "zod";

/**
 * Create a Zod schema for a pre-existing Type
 */
export const zSchemaForType =
  <T>() =>
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };
