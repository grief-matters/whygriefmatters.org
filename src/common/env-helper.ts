/**
 * Helper function to access environment variables in both SSR and build contexts
 * @param key The environment variable key to lookup
 * @returns The environment variable value or undefined
 */
export function getEnvVar<K extends keyof Env>(key: K): Env[K] | undefined {
  // Check if we're in build/client context
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key] as Env[K];
  }

  // Check if we're in SSR context
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] as Env[K];
  }

  return undefined;
}

/**
 * Get all environment variables for the current context
 * @returns Object containing all environment variables
 */
export function getAllEnvVars(): Partial<Env> {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env as Partial<Env>;
  }

  if (typeof process !== "undefined" && process.env) {
    return process.env as Partial<Env>;
  }

  return {};
}

/**
 * Check if we're running in SSR context
 */
export function isSSR(): boolean {
  return typeof import.meta?.env === "undefined";
}
