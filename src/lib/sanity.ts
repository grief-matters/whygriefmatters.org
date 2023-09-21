import { createClient } from "@sanity/client";

const client = createClient({
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: import.meta.env.SANITY_STUDIO_API_VERSION, // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});

export async function getOrganization() {
  const orgs = await client.fetch('*[_id == "organization-singleton"]');

  if (Array.isArray(orgs) && orgs.length > 0) {
    return orgs[0];
  }
}

export default client;
