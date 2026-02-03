import type { InternetResourceType } from "@content/model/internetResource";
import type { OnSurfaceColorVariant } from "./styles";

type IconConfig = {
  colorVariant: OnSurfaceColorVariant;
  icon: IconMapValue;
};

export const iconMap = {
  arrowTopRightOnSquare: "arrow-top-right-on-square",
  newspaper: "newspaper",
  bookOpen: "book-open",
  users: "users",
  userGroup: "user-group",
  globeAlt: "globe-alt",
  arrowDownTray: "arrow-down-tray",
  chatBubbleLeftRight: "chat-bubble-left-right",
  academicCap: "academic-cap",
  film: "film",
  documentDuplicate: "document-duplicate",
  microphone: "microphone",
  rss: "rss",
  chatBubbleLeftEllipsis: "chat-bubble-left-ellipsis",
  heart: "heart",
  printer: "printer",
  computerDesktop: "computer-desktop",
  devicePhoneMobile: "device-phone-mobile",
  documentText: "document-text",
} as const;

export type IconKey = keyof typeof iconMap;
export type IconMapValue = (typeof iconMap)[keyof typeof iconMap];

export const resourceTypeIconMap: Record<InternetResourceType, IconConfig> = {
  article: {
    colorVariant: "primary",
    icon: iconMap.documentText,
  },
  story: {
    colorVariant: "secondary",
    icon: iconMap.newspaper,
  },
  peerSupport: {
    colorVariant: "tertiary",
    icon: iconMap.users,
  },
  supportGroup: {
    colorVariant: "primary",
    icon: iconMap.userGroup,
  },
  therapyResource: {
    colorVariant: "secondary",
    icon: iconMap.chatBubbleLeftRight,
  },
  website: {
    colorVariant: "tertiary",
    icon: iconMap.globeAlt,
  },
  app: {
    colorVariant: "primary",
    icon: iconMap.devicePhoneMobile,
  },
  blog: {
    colorVariant: "secondary",
    icon: iconMap.rss,
  },
  book: {
    colorVariant: "tertiary",
    icon: iconMap.bookOpen,
  },
  course: {
    colorVariant: "primary",
    icon: iconMap.academicCap,
  },
  community: {
    colorVariant: "secondary",
    icon: iconMap.userGroup,
  },
  forum: {
    colorVariant: "tertiary",
    icon: iconMap.chatBubbleLeftEllipsis,
  },
  memorial: {
    colorVariant: "primary",
    icon: iconMap.heart,
  },
  podcast: {
    colorVariant: "secondary",
    icon: iconMap.microphone,
  },
  podcastEpisode: {
    colorVariant: "tertiary",
    icon: iconMap.microphone,
  },
  printedMaterial: {
    colorVariant: "primary",
    icon: iconMap.printer,
  },
  video: {
    colorVariant: "secondary",
    icon: iconMap.film,
  },
  webinar: {
    colorVariant: "tertiary",
    icon: iconMap.computerDesktop,
  },
};
