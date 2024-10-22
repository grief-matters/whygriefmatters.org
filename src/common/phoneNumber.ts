import parse, { type CountryCode } from "libphonenumber-js";

export function getPhoneNumberUri(tel: string, countryCode?: CountryCode) {
  return parse(tel, countryCode ?? "US")?.getURI() ?? null;
}

export function getSmsNumberUri(
  tel: string,
  body?: string,
  countryCode?: CountryCode,
) {
  const parsed = parse(tel, countryCode ?? "US") ?? null;

  if (!parsed) {
    return null;
  }

  return `sms:${parsed.number}${body ? `&body=${body}` : ""}`;
}
