// src/routes/votes.routes.ts
import { Elysia, t } from "elysia";
import { VotesController } from "../controllers/votes.controller";

export const votesRoutes = new Elysia({ prefix: "/votes" })
  // POST /votes - Votar
  .post(
    "/",
    async ({ body, server }) => {
      const result = await VotesController.vote(
        body.postId,
        body.userName,
        body.value,
      );

      // Notificar cambio de puntos por WebSocket
      if (result.success) {
        server?.publish(
          "feed-actualizado",
          JSON.stringify({
            type: "vote_updated",
            postId: body.postId,
            score: result.score,
            userName: body.userName,
          }),
        );
      }

      return result;
    },
    {
      body: t.Object({
        postId: t.Number(),
        userName: t.String(),
        value: t.Number(),
      }),
    },
  )

  // GET /votes/:postId - Obtener puntos de un post
  .get("/:postId", async ({ params }) => {
    return await VotesController.getPostScore(parseInt(params.postId));
  });
