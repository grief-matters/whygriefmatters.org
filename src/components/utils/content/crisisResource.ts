import type {
  ContactMethod,
  Availability,
} from "@content/model/crisisResource";
import type { IconKey } from "@ui/utils/icon";

export const contactTypeIconMap: Record<ContactMethod["contactType"], IconKey> =
  {
    tel: "phone",
    sms: "devicePhoneMobile",
    tty: "devicePhoneMobile",
    email: "envelope",
    liveChat: "chatBubbleLeftEllipsis",
    contactForm: "globeAlt",
  };

export function getContactHref(method: ContactMethod): string | null {
  switch (method.contactType) {
    case "tel":
    case "tty":
      return method.telephoneNumber ? `tel:${method.telephoneNumber}` : null;
    case "sms":
      return method.telephoneNumber ? `sms:${method.telephoneNumber}` : null;
    case "email":
      return method.email ? `mailto:${method.email}` : null;
    case "liveChat":
      return method.liveChatUrl ?? null;
    case "contactForm":
      return method.contactForm ?? null;
    default:
      return null;
  }
}

export function getContactLabel(method: ContactMethod): string {
  switch (method.contactType) {
    case "tel":
      return method.telephoneNumber ?? "Call";
    case "sms":
      return method.telephoneNumber ?? "Text";
    case "tty":
      return method.telephoneNumber ? `TTY: ${method.telephoneNumber}` : "TTY";
    case "email":
      return method.email ?? "Email";
    case "liveChat":
      return "Live Chat";
    case "contactForm":
      return "Contact Form";
  }
}

function formatDays(days: string[]): string {
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weekend = ["Saturday", "Sunday"];
  const allDays = [...weekdays, ...weekend];

  const daySet = new Set(days);

  if (allDays.every((d) => daySet.has(d))) return "Every day";
  if (
    weekdays.every((d) => daySet.has(d)) &&
    !weekend.some((d) => daySet.has(d))
  )
    return "Weekdays";
  if (
    weekend.every((d) => daySet.has(d)) &&
    !weekdays.some((d) => daySet.has(d))
  )
    return "Weekends";

  return days.join(", ");
}

export function formatAvailability(avail: Availability): string {
  const parts: string[] = [];
  if (avail.days && avail.days.length > 0) {
    parts.push(formatDays(avail.days));
  }
  if (avail.availableFrom && avail.availableTo) {
    parts.push(`${avail.availableFrom}–${avail.availableTo}`);
  }
  if (avail.timezone) {
    parts.push(avail.timezone);
  }
  return parts.join(" · ");
}
