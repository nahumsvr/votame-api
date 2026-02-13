import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"), // Aquí guardas la URL de la foto
  userName: varchar("user_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const votes = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userName: varchar("user_name", { length: 255 }).notNull(), // IP, session ID, o user ID real
    value: integer("value").notNull(), // 1 para upvote, -1 para downvote
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    // Un usuario solo puede votar 1 vez por post
    uniqueVote: unique().on(table.postId, table.userName),
  }),
);
