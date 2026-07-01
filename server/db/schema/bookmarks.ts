import { index, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { user } from '@nuxthub/db/schema'

export const bookmarks = sqliteTable('bookmarks', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  title: text('title'),
  description: text('description'),
  siteName: text('site_name'),
  favicon: text('favicon'),
  ogImage: text('og_image'),
  imagePath: text('image_path'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
  notes: text('notes'),
  favorite: integer('favorite', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
}, t => [
  unique('bookmarks_user_url_uniq').on(t.userId, t.url),
  index('bookmarks_user_id_idx').on(t.userId)
])
