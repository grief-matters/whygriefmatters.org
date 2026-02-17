export type Link = {
  label: string;
  url: string;
};

/**
 * Type guard function to determine if a value is a Source object
 * @param link - The value to check
 * @returns True if 'link' is a Link object, false if it's a string
 */
export function isLink(link: unknown): link is Link {
  return (
    (link as Link)?.url !== undefined && (link as Link)?.label !== undefined
  );
}
