import type { APIContext, APIRoute } from "astro";

import {
  createUserEvaluation,
  getUserEvaluation,
  updateUserEvaluation,
} from "@common/client";
import { type ResourceEvaluationItem } from "@model/resourceEvaluation";

export const prerender = false;

export const POST: APIRoute = async (context: APIContext) => {
  const userId = context.locals.auth().userId;

  if (userId === null) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  try {
    const body = await context.request.json();

    const rating = Number(body.rating);
    if (Number.isNaN(rating)) {
      return new Response(null, {
        status: 400,
        statusText: "Supplied rating is not a valid number",
      });
    }

    const evaluationData = await getUserEvaluation(userId, body.resourceId);

    if (!evaluationData.resourceDetails) {
      return new Response(null, {
        status: 404,
        statusText: "Could not find Internet Resource item",
      });
    }

    const partialResponseData: Partial<ResourceEvaluationItem> = {
      id: body.resourceId,
      title: evaluationData.resourceDetails.title,
      resourceUrl: evaluationData.resourceDetails.resourceUrl,
    };

    const response = evaluationData.evaluationDetails
      ? await updateUserEvaluation(evaluationData.evaluationDetails.id, rating)
      : await createUserEvaluation(userId, body.resourceId, rating);

    return new Response(
      JSON.stringify({
        ...partialResponseData,
        rating: response.rating,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};