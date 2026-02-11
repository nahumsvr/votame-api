import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { postsRoutes } from "./routes/posts.routes";
import { feedWebSocket } from "./websockets/feed.ws";

const app = new Elysia()
  .use(cors())

  // Montar rutas HTTP
  .use(postsRoutes)

  // Montar WebSockets
  .use(feedWebSocket)

  // Health check
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
  }))

  // Manejo de 404
  .onError(({ code, error }) => {
    if (code === "NOT_FOUND") {
      return {
        success: false,
        error: "Endpoint no encontrado",
      };
    }

    return {
      success: false,
      error: error,
    };
  })

  .listen(3001);

console.log(`
🚀 Servidor corriendo en http://localhost:${app.server?.port}
📡 WebSocket Feed: ws://localhost:${app.server?.port}/ws/feed
`);
