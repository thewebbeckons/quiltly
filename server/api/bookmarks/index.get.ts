import { and, desc, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { favorite } = getQuery(event)

  const conditions = [eq(schema.bookmarks.userId, user.id)]
  if (favorite === 'true') conditions.push(eq(schema.bookmarks.favorite, true))

  return db.select().from(schema.bookmarks)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(desc(schema.bookmarks.createdAt))
})
