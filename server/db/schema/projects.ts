import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from '@nuxthub/db/schema'
import type { ProjectStatus } from '../../../shared/types/enums'

export const projects = sqliteTable('projects', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  status: text('status').notNull().$type<ProjectStatus>().default('planning'),
  patternSource: text('pattern_source'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  notes: text('notes'),
  imagePath: text('image_path'),
  favourite: integer('favourite').notNull().default(0),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
}, t => [
  index('projects_user_id_idx').on(t.userId),
  index('projects_status_idx').on(t.status)
])
