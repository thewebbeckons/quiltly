import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const [project] = await db.delete(schema.projects)
    .where(and(eq(schema.projects.id, id), eq(schema.projects.userId, user.id))).returning()
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  return { success: true }
})
