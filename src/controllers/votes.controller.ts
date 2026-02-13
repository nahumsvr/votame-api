// src/controllers/votes.controller.ts
import { VotesService } from "../services/votes.service";

export class VotesController {
  static async vote(postId: number, userName: string, value: number) {
    if (value !== 0 && value !== 1 && value !== 3) {
      return {
        success: false,
        error: "Valor de voto inválido",
      };
    }
    try {
      const result = await VotesService.vote(postId, userName, value);
      const newScore = await VotesService.getPostScore(postId);

      return {
        success: true,
        action: result.action,
        currentVote: result.value,
        score: newScore,
      };
    } catch (error) {
      console.error("❌ Error al votar:", error);
      return {
        success: false,
        error: "Error al procesar el voto",
      };
    }
  }

  static async getPostScore(postId: number) {
    try {
      const score = await VotesService.getPostScore(postId);
      return {
        success: true,
        score,
      };
    } catch (error) {
      return {
        success: false,
        error: "Error al obtener puntos",
      };
    }
  }
}
