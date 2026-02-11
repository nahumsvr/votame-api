import { Elysia, t } from "elysia";
import { db } from "../db";
import { posts } from "../db/schema";
import { eq } from "drizzle-orm";

export const postsRoutes = new Elysia({ prefix: "/posts" })
  // GET /posts
  .get("/", async () => {
    try {
      const allPosts = await db.select().from(posts).orderBy(posts.createdAt); // Ordenar por fecha de creación

      return {
        success: true,
        posts: allPosts,
      };
    } catch (error) {
      console.error("❌ Error al obtener posts:", error);
      return {
        success: false,
        error: "Error al obtener los posts",
      };
    }
  })

  // POST /posts
  .post(
    "/",
    async ({ body, server }) => {
      try {
        // 1. Guardar en la base de datos con Drizzle
        const [newPost] = await db
          .insert(posts)
          .values({
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl,
            userName: body.userName,
            createdAt: new Date(),
          })
          .returning();

        console.log("✅ Post creado:", newPost);

        // 2. Notificar a todos los clientes WebSocket conectados
        server?.publish(
          "feed-actualizado",
          JSON.stringify({
            type: "new_post",
            post: newPost,
          }),
        );

        return {
          success: true,
          post: newPost,
        };
      } catch (error) {
        console.error("❌ Error al crear post:", error);
        return {
          success: false,
          error: "Error al guardar el post\n" + error,
        };
      }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1, maxLength: 255 }),
        description: t.String(),
        imageUrl: t.String(),
        userName: t.String(),
      }),
    },
  )

  // GET /posts/:id
  .get("/:id", async ({ params }) => {
    try {
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, parseInt(params.id)));
      if (!post) {
        return {
          success: false,
          error: "Post no encontrado",
        };
      }
      return { success: true, post: post[0] };
    } catch (error) {
      console.error("❌ Error al obtener post:", error);
      return {
        success: false,
        error: "Error al obtener el post",
      };
    }
  });
