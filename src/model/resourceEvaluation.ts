import { z } from "zod";
import groq from "groq";

import {
  internetResourceTypes,
  zInternetResourceType,
} from "./internetResource";

export function getResourceEvaluationDataQuery(userId: string) {
  const queryStrings = internetResourceTypes.map(
    (type) => groq`
      "${type}": *[_type == "${type}"] {
        "id": _id,
        "title": coalesce(title, name),
        "resourceUrl": coalesce(resourceUrl, appleUrl, spotifyUrl, playStoreUrl),
        "rating": *[_type == 'resourceEvaluation' && userId == '${userId}' && resourceId == ^._id][0].rating
      }
    `,
  );

  const query = `{${queryStrings.join(",")}}`;

  return query;
}

const zResourceEvaluationItem = z.object({
  id: z.string(),
  title: z.string(),
  resourceUrl: z.string(),
  rating: z.number().nullable(),
});

export const zResourceEvaluationData = z.record(
  zInternetResourceType,
  z.array(zResourceEvaluationItem),
);

export type ResourceEvaluationItem = z.infer<typeof zResourceEvaluationItem>;
export type ResourceEvaluationData = z.infer<typeof zResourceEvaluationData>;
