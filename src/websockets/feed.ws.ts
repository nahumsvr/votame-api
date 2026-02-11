import { Elysia } from "elysia";

export const feedWebSocket = new Elysia().ws("/ws/feed", {
  open(ws) {
    console.log("✅ Cliente conectado al feed");
    ws.subscribe("feed-actualizado");

    // Mensaje de bienvenida
    ws.send(
      JSON.stringify({
        type: "connected",
        message: "Conectado al feed en tiempo real",
      }),
    );
  },

  message(ws, message) {
    console.log("📩 Mensaje recibido en feed:", message);
    // Aquí podrías manejar mensajes del cliente si lo necesitas
  },

  close(ws) {
    console.log("❌ Cliente desconectado del feed");
  },
});
