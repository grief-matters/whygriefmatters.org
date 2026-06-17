import type { PortableText } from "@content/model/portableText";

type PortableTextChild = { _type?: string; text?: string };

export function portableTextToPlain(
  input: string | PortableText | null | undefined,
): string {
  if (input == null) {
    return "";
  }
  if (typeof input === "string") {
    return input;
  }

  const parts: string[] = [];
  for (const block of input) {
    if (!block || typeof block !== "object") {
      continue;
    }
    if ((block as { _type?: string })._type !== "block") {
      continue;
    }
    const children = (block as { children?: Array<PortableTextChild> })
      .children;
    if (!Array.isArray(children)) {
      continue;
    }
    const text = children
      .filter((c) => c && c._type === "span" && typeof c.text === "string")
      .map((c) => c.text as string)
      .join("");
    if (text) {
      parts.push(text);
    }
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}
