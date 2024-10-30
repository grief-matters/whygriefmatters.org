import { getAuthedClient } from "@common/client";
import { zEvaluation, type Evaluation } from "@model/evaluation";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const evaluation = {
  upsertEvaluation: defineAction({
    accept: "form",
    input: z.object({
      resourceID: z.string(),
      rating: z.number().min(1).max(10),
    }),
    handler: async (input, context) => {
      const userID = context.locals.auth().userId;

      if (userID === null) {
        throw new ActionError({ code: "UNAUTHORIZED" });
      }

      const client = getAuthedClient();

      try {
        const existingEvaluation: Evaluation | null = await client
          .fetch(
            `*[_type == 'resourceEvaluation' 
            && userID == '${userID}' 
            && resourceID == '${input.resourceID}'][0]{
              "id": _id,
              userID,
              resourceID,
              rating
            }`,
          )
          .then((result) => zEvaluation.nullable().parse(result));

        // If we already have an evaluation for this resource, for this user
        // create a 'patch'
        if (existingEvaluation) {
          const res = await client
            .patch(existingEvaluation.id)
            .set({ rating: input.rating })
            .commit();

          // Patched and parsed document
          return zEvaluation.parse({
            id: res._id,
            userID: res.userID,
            resourceID: res.resourceID,
            rating: res.rating,
          });
        }

        // Otherwise we can create it from scratch
        const doc = {
          _type: "resourceEvaluation",
          userID,
          resourceID: input.resourceID,
          rating: input.rating,
        };

        const res = await client.create(doc);

        return zEvaluation.parse({
          id: res._id,
          userID: res.userID,
          resourceID: res.resourceID,
          rating: res.rating,
        });
      } catch (error) {
        console.log("Debug to console: ", error);
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });
      }
    },
  }),
};
