import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from '@nuxthub/db/schema'
import type { SupplyMetadata, SupplyType } from '../../../shared/types/enums'

export const supplies = sqliteTable('supplies', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull().$type<SupplyType>(),
  quantity: real('quantity').notNull().default(0),
  unit: text('unit'),
  color: text('color'),
  lowStockThreshold: real('low_stock_threshold').notNull().default(1),
  metadata: text('metadata', { mode: 'json' }).$type<SupplyMetadata | null>(),
  notes: text('notes'),
  imagePath: text('image_path'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
}, t => [
  index('supplies_user_id_idx').on(t.userId)
])
