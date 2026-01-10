import { loadSanityQuery } from "./sanityQueryLoader";

import { zOrganization } from "@content/model/organization";
import organizationQuery from "@content/queries/organization.groq?raw";

export async function getOrganization() {
  const org = await loadSanityQuery({ query: organizationQuery });
  return zOrganization.parse(org);
}
