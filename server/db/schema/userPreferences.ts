import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from '@nuxthub/db/schema'

export const userPreferences = sqliteTable('user_preferences', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  onboardingVersion: integer('onboarding_version').notNull().default(0),
  onboardingCompletedAt: integer('onboarding_completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
