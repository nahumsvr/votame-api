import { PostsService } from "../services/posts.service";

export class PostsController {
  // Crear post
  static async create(data: {
    title: string;
    userName: string;
    description: string;
    imageUrl: string;
  }) {
    try {
      const newPost = await PostsService.create(data);
      return {
        success: true,
        post: newPost,
      };
    } catch (error) {
      console.error("❌ Error al crear post:", error);
      return {
        success: false,
        error: "Error al crear el post",
      };
    }
  }

  // Obtener todos los posts
  static async getAll() {
    try {
      const posts = await PostsService.getAll();
      return {
        success: true,
        posts,
      };
    } catch (error) {
      console.error("❌ Error al obtener posts:", error);
      return {
        success: false,
        error: "Error al obtener los posts",
      };
    }
  }

  static async getTrending() {
    try {
      const trendingPosts = await PostsService.getTrending();
      return {
        success: true,
        posts: trendingPosts,
      };
    } catch (error) {
      return {
        success: false,
        error: "Error al obtener trending posts",
      };
    }
  }

  // Obtener un post
  static async getById(id: number) {
    try {
      const post = await PostsService.getById(id);

      if (!post) {
        return {
          success: false,
          error: "Post no encontrado",
        };
      }

      return {
        success: true,
        post,
      };
    } catch (error) {
      console.error("❌ Error al obtener post:", error);
      return {
        success: false,
        error: "Error al obtener el post",
      };
    }
  }

  // Actualizar post
  static async update(
    id: number,
    data: Partial<{
      title: string;
      description: string;
      imageUrl: string;
    }>,
  ) {
    try {
      const updatedPost = await PostsService.update(id, data);

      if (!updatedPost) {
        return {
          success: false,
          error: "Post no encontrado",
        };
      }

      return {
        success: true,
        post: updatedPost,
      };
    } catch (error) {
      console.error("❌ Error al actualizar post:", error);
      return {
        success: false,
        error: "Error al actualizar el post",
      };
    }
  }

  // Eliminar post
  static async delete(id: number) {
    try {
      await PostsService.delete(id);
      return {
        success: true,
        message: "Post eliminado correctamente",
      };
    } catch (error) {
      console.error("❌ Error al eliminar post:", error);
      return {
        success: false,
        error: "Error al eliminar el post",
      };
    }
  }
}
