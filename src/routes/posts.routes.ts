import { Elysia } from "elysia";
import { PostsController } from "../controllers/posts.controller";
import {
  createPostSchema,
  updatePostSchema,
} from "../validators/posts.validator";

export const postsRoutes = new Elysia({ prefix: "/posts" })
  // GET /posts - Obtener todos
  .get("/", async () => {
    return await PostsController.getAll();
  })

  // GET /posts/trending - Top posts por puntaje
  .get("/trending", async () => {
    return await PostsController.getTrending();
  })

  // GET /posts/:id - Obtener uno
  .get("/:id", async ({ params }) => {
    return await PostsController.getById(parseInt(params.id));
  })

  // POST /posts - Crear
  .post(
    "/",
    async ({ body, server }) => {
      const result = await PostsController.create(body);

      // Si se creó exitosamente, notificar a WebSocket
      if (result.success) {
        server?.publish(
          "feed-actualizado",
          JSON.stringify({
            type: "new_post",
            post: result.post,
          }),
        );
      }

      return result;
    },
    {
      body: createPostSchema,
    },
  )

  // PATCH /posts/:id - Actualizar
  .patch(
    "/:id",
    async ({ params, body, server }) => {
      const result = await PostsController.update(parseInt(params.id), body);

      // Notificar actualización
      if (result.success) {
        server?.publish(
          "feed-actualizado",
          JSON.stringify({
            type: "post_updated",
            post: result.post,
          }),
        );
      }

      return result;
    },
    {
      body: updatePostSchema,
    },
  )

  // DELETE /posts/:id - Eliminar
  .delete("/:id", async ({ params, server }) => {
    const result = await PostsController.delete(parseInt(params.id));

    // Notificar eliminación
    if (result.success) {
      server?.publish(
        "feed-actualizado",
        JSON.stringify({
          type: "post_deleted",
          postId: params.id,
        }),
      );
    }

    return result;
  });
