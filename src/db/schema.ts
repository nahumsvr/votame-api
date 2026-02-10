import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'), // Aquí guardas la URL de la foto
  createdAt: timestamp('created_at').defaultNow(),
});