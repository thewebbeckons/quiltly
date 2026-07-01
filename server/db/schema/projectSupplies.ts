import { index, integer, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { projects } from './projects'
import { supplies } from './supplies'

export const projectSupplies = sqliteTable('project_supplies', {
  id: integer().primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  supplyId: integer('supply_id').notNull().references(() => supplies.id, { onDelete: 'cascade' }),
  quantityUsed: real('quantity_used').notNull(),
  unit: text('unit'),
  consumed: integer('consumed', { mode: 'boolean' }).notNull().default(false),
  consumedAt: integer('consumed_at', { mode: 'timestamp' }),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
}, t => [
  unique('project_supplies_project_supply_uniq').on(t.projectId, t.supplyId),
  index('project_supplies_project_idx').on(t.projectId),
  index('project_supplies_supply_idx').on(t.supplyId)
])
