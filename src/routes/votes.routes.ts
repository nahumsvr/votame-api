// src/routes/votes.routes.ts
import { Elysia } from "elysia";
import { VotesController } from "../controllers/votes.controller";
import { voteSchema, getPostScoreSchema } from "../validators/votes.validator";

export const votesRoutes = new Elysia({ prefix: "/votes" })
  // POST /votes - Votar
  .post(
    "/",
    async ({ body, server }) => {
      const { postId, userName, points } = body;
      const result = await VotesController.vote(postId, userName, points);

      // Notificar cambio de puntos por WebSocket
      if (result.success) {
        server?.publish(
          "feed-actualizado",
          JSON.stringify({
            type: "vote_updated",
            postId: postId,
            score: result.score,
            userName: userName,
          }),
        );
      }

      return result;
    },
    {
      body: voteSchema,
    },
  )

  // GET /votes/:postId - Obtener puntos de un post
  .get(
    "/:postId",
    async ({ params }) => {
      return await VotesController.getPostScore(parseInt(params.postId));
    },
    {
      params: getPostScoreSchema,
    },
  );
