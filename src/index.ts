import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { postsRoutes } from "./routes/posts";
import { feedWebSocket } from "./websockets/feed";

const app = new Elysia()
  .use(cors())
  .use(postsRoutes) // Monta las rutas de posts
  .use(feedWebSocket) // Monta el WebSocket del feed
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(
  `🚀 Backend corriendo en ${app.server?.hostname}:${app.server?.port}
  posts: http://localhost:3001/posts
  websocket: ws://localhost:3001/ws/feed`,
);
