import type { ZodType } from "astro:schema";
import type { QueryParams } from "@sanity/client";

import { getSanityClient } from "@sanity-integration/sanity-client";

type SanityLoaderParams = {
  query: string;
  queryParams?: QueryParams;
  schema?: ZodType;
};

export async function loadSanityQuery(params: SanityLoaderParams) {
  const client = getSanityClient();
  const queryResult = await client.fetch(params.query, params.queryParams);

  if (params.schema) {
    const safeParsed = params.schema.array().safeParse(queryResult);

    // Claude generated - needs review at some point
    if (!safeParsed.success) {
      console.error("Sanity query validation failed");
      console.error("Query:", params.query);

      safeParsed.error.issues.forEach((issue, index) => {
        console.error(`\n--- Issue ${index + 1} ---`);
        console.error("Path:", issue.path.join(" → "));
        console.error("Error:", issue.message);

        // Navigate to the exact data that caused the issue
        let problematicData = queryResult;
        for (const segment of issue.path) {
          if (problematicData !== null && problematicData !== undefined) {
            problematicData = problematicData[segment];
            console.log(problematicData);
          }
        }

        console.error(
          "Received data:",
          JSON.stringify(problematicData, null, 2),
        );
      });

      throw new Error(
        `Sanity query validation failed with ${safeParsed.error.issues.length} issue(s)`,
      );
    }
  }

  return queryResult;
}
