/** Converts an ISO date string to a locale-formatted date (e.g. "Jan 1, 2025"). */
export function getLocaleDateStringFromIsoString(
  isoStringDateTime: string,
): string | null {
  const d = new Date(isoStringDateTime);
  if (d.toString() === "Invalid Date") {
    return null;
  }

  const dateString = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return dateString;
}
