import { db } from "../db";
import { posts } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export class PostsService {
  // Crear un post
  static async create(data: {
    title: string;
    userName: string;
    description: string;
    imageUrl: string;
  }) {
    const [newPost] = await db
      .insert(posts)
      .values({
        title: data.title,
        userName: data.userName,
        description: data.description,
        imageUrl: data.imageUrl,
        createdAt: new Date(),
      })
      .returning();

    return newPost;
  }

  // Obtener todos los posts
  static async getAll() {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  // Obtener un post por ID
  static async getById(id: number) {
    const result = await db.select().from(posts).where(eq(posts.id, id));

    return result[0] || null;
  }

  // Actualizar un post
  static async update(
    id: number,
    data: Partial<{
      title: string;
      userName: string;
      description: string;
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
}
