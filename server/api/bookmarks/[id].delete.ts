import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const [bookmark] = await db.delete(schema.bookmarks)
    .where(and(eq(schema.bookmarks.id, id), eq(schema.bookmarks.userId, user.id))).returning()
  if (!bookmark) throw createError({ statusCode: 404, statusMessage: 'Bookmark not found' })

  return { success: true }
})
