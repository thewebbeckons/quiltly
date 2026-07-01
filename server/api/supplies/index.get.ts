import { and, desc, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'
import type { SupplyType } from '~~/shared/types/enums'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { type } = getQuery(event)

  const conditions = [eq(schema.supplies.userId, user.id)]
  if (typeof type === 'string' && type) {
    conditions.push(eq(schema.supplies.type, type as SupplyType))
  }

  return db.select().from(schema.supplies)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(desc(schema.supplies.updatedAt))
})
