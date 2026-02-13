import { t } from "elysia";

export const createPostSchema = t.Object({
  title: t.String({ minLength: 1, maxLength: 255 }),
  userName: t.String(),

  imageUrl: t.String(),
});

export const updatePostSchema = t.Object({
  title: t.Optional(t.String({ minLength: 1, maxLength: 255 })),

  imageUrl: t.Optional(t.String()),
});
