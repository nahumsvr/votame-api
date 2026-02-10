import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { db } from "./db";
import { posts } from "./db/schema";

const app = new Elysia()
  .use(cors())

  // Canal de WebSockets
  .ws("/ws", {
    open(ws) {
      console.log("✅ Cliente conectado");
      ws.subscribe("feed-actualizado");
    },

    message(ws, message) {
      console.log("📩 Mensaje recibido:", message);
      // Puedes agregar lógica adicional aquí si quieres
      // Por ejemplo, validar mensajes del cliente
    },

    close(ws) {
      console.log("❌ Cliente desconectado");
    },
  })

  // Endpoint para crear un post
  .post(
    "/posts",
    async ({ body, server }) => {
      try {
        // 1. Guardar en la base de datos con Drizzle
        const [newPost] = await db
          .insert(posts)
          .values({
            title: body.title,
            description: body.description,
            imageUrl: body.imageUrl,
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
      }),
    },
  )

  // Endpoint GET para obtener todos los posts (útil para cargar el feed inicial)
  .get("/posts", async () => {
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

  .listen(3001);

console.log(
  `🚀 Backend corriendo en ${app.server?.hostname}:${app.server?.port}`,
);
