import { loadSanityQuery } from "./sanityQueryLoader";

import { zOrganization } from "@content/model/organization";
import type { Organization } from "@content/model/organization";
import organizationQuery from "@content/queries/organization.groq?raw";

let cachedOrganization: Organization | undefined;

export async function getOrganization() {
  if (cachedOrganization) return cachedOrganization;

  const org = await loadSanityQuery({ query: organizationQuery });
  cachedOrganization = zOrganization.parse(org);
  return cachedOrganization;
}
