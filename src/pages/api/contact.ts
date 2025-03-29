import type { APIRoute, APIContext } from "astro";

export const prerender = false;

export const POST: APIRoute = async (context: APIContext) => {
  try {
    const data = await context.request.json();
    console.log("Recieved submission: ", data);

    return new Response(
      JSON.stringify({ message: "contact submission success!!!" }),
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
