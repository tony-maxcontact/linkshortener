import {
  pgTable,
  text,
  timestamp,
  integer,
  varchar,
} from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  shortCode: varchar('short_code', { length: 20 }).notNull().unique(),
  originalUrl: text('original_url').notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});
