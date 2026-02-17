// src/services/votes.service.ts
import { db } from "../db";
import { votes, posts } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

export class VotesService {
  // Votar o cambiar voto
  static async vote(postId: number, userName: string, points: 0 | 1 | 3) {
    // Buscar si ya votó
    const existingVote = await db
      .select()
      .from(votes)
      .where(and(eq(votes.postId, postId), eq(votes.userName, userName)))
      .limit(1);
    const currentVote = existingVote[0];

    if (!currentVote) {
      // Nuevo voto
      await db.insert(votes).values({
        postId,
        userName: userName,
        points,
      });
      return { action: "created", points };
    }
    // Ya votó, actualizar o eliminar
    if (currentVote.points === points) {
      // Mismo voto, eliminar (toggle)
      await db.delete(votes).where(eq(votes.id, currentVote.id));
      return { action: "removed", points: 0 };
    }
    // Cambiar voto (de upvote a downvote o viceversa)
    await db.update(votes).set({ points }).where(eq(votes.id, currentVote.id));
    return { action: "changed", points };
  }

  // Obtener puntos de un post (suma de votos)
  static async getPostScore(postId: number) {
    const result = await db
      .select({ total: sql<number>`COALESCE(SUM(${votes.points}), 0)` })
      .from(votes)
      .where(eq(votes.postId, postId));

    return result[0]?.total || 0;
  }

  // Obtener voto de un usuario en un post
  static async getUserVote(postId: number, userId: string) {
    const result = await db
      .select()
      .from(votes)
      .where(and(eq(votes.postId, postId), eq(votes.userName, userId)))
      .limit(1);

    return result[0]?.points || 0;
  }

  // Obtener posts con sus puntos (para el feed)
  static async getPostsWithScores() {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,

        imageUrl: posts.imageUrl,
        createdAt: posts.createdAt,
        score: sql<number>`COALESCE(SUM(${votes.points}), 0)`,
      })
      .from(posts)
      .leftJoin(votes, eq(posts.id, votes.postId))
      .groupBy(posts.id)
      .orderBy(sql`score DESC`);

    return result;
  }
}
