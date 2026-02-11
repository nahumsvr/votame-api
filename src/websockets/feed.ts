import { Elysia } from "elysia";

export const feedWebSocket = new Elysia().ws("/ws/feed", {
  open(ws) {
    console.log("✅ Cliente conectado al feed");
    ws.subscribe("feed-actualizado");
  },
  message(ws, message) {
    console.log("📩 Mensaje en feed:", message);
  },
  close(ws) {
    console.log("❌ Cliente desconectado del feed");
  },
});
