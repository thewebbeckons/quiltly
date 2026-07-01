import { and, desc, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'
import type { ProjectStatus } from '~~/shared/types/enums'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { status } = getQuery(event)

  const conditions = [eq(schema.projects.userId, user.id)]
  if (typeof status === 'string' && status) {
    conditions.push(eq(schema.projects.status, status as ProjectStatus))
  }

  return db.select().from(schema.projects)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(desc(schema.projects.favourite), desc(schema.projects.updatedAt))
})
