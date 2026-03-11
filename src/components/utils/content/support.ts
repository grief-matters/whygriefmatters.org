import type { CategoryTreeNode } from "./category";

export const supportCollections = [
  { key: "supportGroups", title: "Support Groups", slug: "support-groups" },
  { key: "peerSupports", title: "Peer Support", slug: "peer-support" },
  {
    key: "therapyResources",
    title: "Therapy/Counselling",
    slug: "therapy-resources",
  },
  { key: "forums", title: "Forums", slug: "forums" },
] as const;

export type SupportCollectionKey = (typeof supportCollections)[number]["key"];

export function buildGetSupportNode(): CategoryTreeNode {
  return {
    id: "get-support",
    slug: "get-support",
    title: "Get Support (Groups, Therapy, Crisis)",
    displayTitle: "Get Support",
    children: supportCollections.map(({ key, title, slug }) => ({
      id: key,
      slug,
      title,
      displayTitle: title,
      children: [],
      href: `/get-support/${slug}`,
    })),
  };
}
