import { describe, expect, it, mock, beforeEach } from "bun:test";
import { PostsController } from "./posts.controller";

// Mock data for trending posts (ordered by score descending)
const mockTrendingPosts = [
  { id: 3, title: "Post 3", description: "Desc 3", imageUrl: "url3", createdAt: new Date(), score: 100 },
  { id: 1, title: "Post 1", description: "Desc 1", imageUrl: "url1", createdAt: new Date(), score: 50 },
  { id: 2, title: "Post 2", description: "Desc 2", imageUrl: "url2", createdAt: new Date(), score: 25 },
];

// Mock PostsService
mock.module("../services/posts.service", () => ({
  PostsService: {
    getTrending: mock(() => Promise.resolve(mockTrendingPosts)),
    create: mock(() => Promise.resolve({ id: 1, title: "Test", score: 0 })),
    getAll: mock(() => Promise.resolve([])),
    getById: mock(() => Promise.resolve(null)),
    update: mock(() => Promise.resolve(null)),
    delete: mock(() => Promise.resolve(true)),
  },
}));

describe("PostsController", () => {
  describe("getTrending", () => {
    it("should return posts ordered by score (highest first)", async () => {
      const result = await PostsController.getTrending();

      expect(result.success).toBe(true);
      expect(result.posts).toBeDefined();
      expect(result.posts!.length).toBe(3);

      // Verify posts are ordered by score descending
      expect(result.posts![0].score).toBe(100);
      expect(result.posts![1].score).toBe(50);
      expect(result.posts![2].score).toBe(25);

      // Verify the order matches expected post IDs
      expect(result.posts![0].id).toBe(3);
      expect(result.posts![1].id).toBe(1);
      expect(result.posts![2].id).toBe(2);
    });

    it("should return success: true with posts array", async () => {
      const result = await PostsController.getTrending();

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("posts");
      expect(Array.isArray(result.posts)).toBe(true);
    });
  });
});
