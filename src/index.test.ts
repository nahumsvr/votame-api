import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

// In-memory store for testing (simulates database)
let postsStore: Array<{
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  userName: string;
  createdAt: Date;
}> = [];
let nextId = 1;

// Create a test app that mirrors the real app but uses in-memory storage
const createTestApp = () => {
  postsStore = [];
  nextId = 1;

  return new Elysia()
    .use(cors())
    .get("/health", () => ({ status: "ok" }))
    .get("/posts", () => ({
      success: true,
      posts: postsStore,
    }))
    .post(
      "/posts",
      ({ body }) => {
        const newPost = {
          id: nextId++,
          title: body.title,
          description: body.description,
          imageUrl: body.imageUrl,
          userName: body.userName,
          createdAt: new Date(),
        };
        postsStore.push(newPost);
        return {
          success: true,
          post: newPost,
        };
      },
      {
        body: t.Object({
          title: t.String({ minLength: 1, maxLength: 255 }),
          description: t.String(),
          imageUrl: t.String(),
          userName: t.String(),
        }),
      },
    )
    .get("/posts/:id", ({ params }) => {
      const post = postsStore.find((p) => p.id === parseInt(params.id));
      if (!post) {
        return {
          success: false,
          error: "Post no encontrado",
        };
      }
      return { success: true, post };
    });
};

describe("Health endpoint", () => {
  it("should return ok status", async () => {
    const app = createTestApp();

    const response = await app.handle(
      new Request("http://localhost/health", { method: "GET" }),
    );

    expect(response.status).toBe(200);
    const data: any = await response.json();
    expect(data).toEqual({ status: "ok" });
  });
});

describe("POST /posts", () => {
  it("should create a new post successfully with userName field", async () => {
    const app = createTestApp();

    const newPost = {
      title: "Test Post",
      description: "This is a test description",
      imageUrl: "https://example.com/image.jpg",
      userName: "testuser",
    };

    const response = await app.handle(
      new Request("http://localhost/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      }),
    );

    expect(response.status).toBe(200);
    const data: any = await response.json();
    expect(data.success).toBe(true);
    expect(data.post).toBeDefined();
    expect(data.post.title).toBe(newPost.title);
    expect(data.post.description).toBe(newPost.description);
    expect(data.post.imageUrl).toBe(newPost.imageUrl);
    expect(data.post.userName).toBe(newPost.userName);
    expect(data.post.id).toBeDefined();
    expect(data.post.createdAt).toBeDefined();
  });

  it("should fail when userName field is missing", async () => {
    const app = createTestApp();

    const invalidPost = {
      title: "Test Post",
      description: "This is a test description",
      imageUrl: "https://example.com/image.jpg",
      // userName is missing
    };

    const response = await app.handle(
      new Request("http://localhost/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidPost),
      }),
    );

    // Elysia returns 422 for validation errors
    expect(response.status).toBe(422);
  });

  it("should fail when title field is missing", async () => {
    const app = createTestApp();

    const invalidPost = {
      description: "This is a test description",
      imageUrl: "https://example.com/image.jpg",
      userName: "testuser",
      // title is missing
    };

    const response = await app.handle(
      new Request("http://localhost/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidPost),
      }),
    );

    expect(response.status).toBe(422);
  });

  it("should fail when title exceeds max length", async () => {
    const app = createTestApp();

    const invalidPost = {
      title: "a".repeat(256), // exceeds maxLength of 255
      description: "This is a test description",
      imageUrl: "https://example.com/image.jpg",
      userName: "testuser",
    };

    const response = await app.handle(
      new Request("http://localhost/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidPost),
      }),
    );

    expect(response.status).toBe(422);
  });
});

describe("GET /posts/:id", () => {
  it("should retrieve a specific post by ID", async () => {
    const app = createTestApp();

    // First create a post
    const newPost = {
      title: "Test Post",
      description: "This is a test description",
      imageUrl: "https://example.com/image.jpg",
      userName: "testuser",
    };

    await app.handle(
      new Request("http://localhost/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      }),
    );

    // Then retrieve it by ID
    const response = await app.handle(
      new Request("http://localhost/posts/1", { method: "GET" }),
    );

    expect(response.status).toBe(200);
    const data: any = await response.json();
    expect(data.success).toBe(true);
    expect(data.post).toBeDefined();
    expect(data.post.id).toBe(1);
    expect(data.post.title).toBe(newPost.title);
    expect(data.post.description).toBe(newPost.description);
    expect(data.post.imageUrl).toBe(newPost.imageUrl);
    expect(data.post.userName).toBe(newPost.userName);
  });

  it("should return error for non-existent post ID", async () => {
    const app = createTestApp();

    const response = await app.handle(
      new Request("http://localhost/posts/999", { method: "GET" }),
    );

    expect(response.status).toBe(200);
    const data: any = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Post no encontrado");
  });

  it("should return error for invalid post ID", async () => {
    const app = createTestApp();

    const response = await app.handle(
      new Request("http://localhost/posts/invalid", { method: "GET" }),
    );

    expect(response.status).toBe(200);
    const data: any = await response.json();
    expect(data.success).toBe(false);
  });
});
