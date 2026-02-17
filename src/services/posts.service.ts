import { db } from "../db";
import { posts, votes } from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";

export class PostsService {
  // Crear un post
  static async create(data: {
    title: string;
    link?: string;
    userName: string;
    imageUrl: string;
  }) {
    const [newPost] = await db
      .insert(posts)
      .values({
        title: data.title,
        link: data.link || null,
        userName: data.userName,
        imageUrl: data.imageUrl,
        createdAt: new Date(),
      })
      .returning();

    return {
      ...newPost,
      score: 0,
    };
  }

  // Obtener todos los posts
  static async getAll() {
    const result = await db
      .select({
        id: posts.id,
        userName: posts.userName,
        title: posts.title,
        link: posts.link,
        imageUrl: posts.imageUrl,
        createdAt: posts.createdAt,
        score: sql<number>`COALESCE(SUM(${votes.points}), 0)`.as("score"),
      })
      .from(posts)
      .leftJoin(votes, eq(posts.id, votes.postId))
      .groupBy(posts.id)
      .orderBy(desc(posts.createdAt)); // O puedes ordenar por score

    return result;
  }

  // Obtener un post por ID
  static async getById(id: number) {
    // const result = await db.select().from(posts).where(eq(posts.id, id));

    // return result[0] || null;
    const result = await db
      .select({
        id: posts.id,
        userName: posts.userName,
        title: posts.title,
        link: posts.link,
        imageUrl: posts.imageUrl,
        createdAt: posts.createdAt,
        score: sql<number>`COALESCE(SUM(${votes.points}), 0)`.as("score"),
      })
      .from(posts)
      .leftJoin(votes, eq(posts.id, votes.postId))
      .where(eq(posts.id, id))
      .groupBy(posts.id);

    return result[0] || null;
  }

  // Actualizar un post
  static async update(
    id: number,
    data: Partial<{
      title: string;
      link: string;
      imageUrl: string;
    }>,
  ) {
    const [updatedPost] = await db
      .update(posts)
      .set(data)
      .where(eq(posts.id, id))
      .returning();

    return updatedPost;
  }

  // Eliminar un post
  static async delete(id: number) {
    await db.delete(posts).where(eq(posts.id, id));
    return true;
  }

  // Obtener posts ordenados por puntaje (trending)
  static async getTrending() {
    const result = await db
      .select({
        id: posts.id,
        userName: posts.userName,
        title: posts.title,
        link: posts.link,
        imageUrl: posts.imageUrl,
        createdAt: posts.createdAt,
        score: sql<number>`COALESCE(SUM(${votes.points}), 0)`.as("score"),
      })
      .from(posts)
      .leftJoin(votes, eq(posts.id, votes.postId))
      .groupBy(posts.id)
      .orderBy(sql`score DESC`);

    return result;
  }
}
