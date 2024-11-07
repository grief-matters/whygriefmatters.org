import { getAuthedClient, getClient } from "@common/client";
import {
  getResourceEvaluationDataQuery,
  zResourceEvaluationData,
  type ResourceEvaluationItem,
} from "@model/resourceEvaluation";
import type { APIContext, APIRoute } from "astro";
import groq from "groq";

export const prerender = false;

export const GET: APIRoute = async (context: APIContext) => {
  const userId = context.locals.auth().userId;

  // Only return results from this endpoint to authenticated users
  if (userId === null) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  try {
    const client = getClient(false);
    const data = await client
      .fetch(getResourceEvaluationDataQuery(userId))
      .then((result) => zResourceEvaluationData.parse(result));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    const query = groq`
      {
        "resourceEvaluationItem": *[_id == '${body.resourceId}'][0]{
          "id": _id,
          "title": coalesce(title, name),
          "resourceUrl": coalesce(resourceUrl, appleUrl, spotifyUrl, playStoreUrl),
        },
        "resourceEvaluation": *[_type == 'resourceEvaluation' 
        && userId == '${userId}' 
        && resourceId == '${body.resourceId}'][0]{
          "id": _id,
          userId,
          resourceId,
          rating
        }
      }
    `;

    const client = getAuthedClient(false);
    const evaluationData = await client.fetch(query);

    if (!evaluationData.resourceEvaluationItem) {
      return new Response(null, {
        status: 404,
        statusText: "Not found",
      });
    }

    const partialResponseData: Partial<ResourceEvaluationItem> = {
      id: body.resourceId,
      title: evaluationData.resourceEvaluationItem.title,
      resourceUrl: evaluationData.resourceEvaluationItem.resourceUrl,
    };

    // If we already have an evaluation for this resource, for this user
    // create a 'patch'
    if (evaluationData.resourceEvaluation) {
      const res = await client
        .patch(evaluationData.resourceEvaluation.id)
        .set({ rating: Number(body.rating) })
        .commit();

      return new Response(
        JSON.stringify({
          ...partialResponseData,
          rating: res.rating,
        }),
        {
          status: 200,
        },
      );
    }

    const doc = {
      _type: "resourceEvaluation",
      userId: userId,
      resourceId: body.resourceId,
      rating: Number(body.rating),
    };

    const res = await client.create(doc);
    return new Response(
      JSON.stringify({
        ...partialResponseData,
        rating: res.rating,
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
