import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const body = await readValidatedBody(event, bookmarkPatchSchema.parse)
  const [bookmark] = await db.update(schema.bookmarks).set({
    ...body,
    updatedAt: new Date()
  }).where(and(eq(schema.bookmarks.id, id), eq(schema.bookmarks.userId, user.id))).returning()

  if (!bookmark) throw createError({ statusCode: 404, statusMessage: 'Bookmark not found' })
  return bookmark
})
