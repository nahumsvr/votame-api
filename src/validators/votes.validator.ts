import { t } from "elysia";

export const voteSchema = t.Object({
  postId: t.Number(),
  userName: t.String({ minLength: 1 }),
  points: t.Number(), // Valid values: 0, 1, 3
});

export const getPostScoreSchema = t.Object({
  postId: t.String(),
});
