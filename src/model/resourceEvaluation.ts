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

export const gUserEvaluation = groq`
  {
    "resourceDetails": *[_id == $resourceId][0]{
      "id": _id,
      "title": coalesce(title, name),
      "resourceUrl": coalesce(resourceUrl, appleUrl, spotifyUrl, playStoreUrl),
    },
    "evaluationDetails": *[_type == 'resourceEvaluation' 
    && userId == $userId 
    && resourceId == $resourceId][0]{
      "id": _id,
      userId,
      resourceId,
      rating
    }
  }
`;

export const zUserEvaluation = z.object({
  resourceDetails: z
    .object({
      id: z.string(),
      title: z.string(),
      resourceUrl: z.string().url(),
    })
    .nullable(),
  evaluationDetails: z
    .object({
      id: z.string(),
      userId: z.string(),
      resourceId: z.string(),
      rating: z.number().nullable(),
    })
    .nullable(),
});

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
export type UserEvaluation = z.infer<typeof zUserEvaluation>;
