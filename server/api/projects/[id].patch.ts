import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'
import { consumeProjectSupplies } from '~~/server/utils/inventory'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const [existing] = await db.select().from(schema.projects)
    .where(and(eq(schema.projects.id, id), eq(schema.projects.userId, user.id)))
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const body = await readValidatedBody(event, projectPatchSchema.parse)
  const now = new Date()
  const completing = body.status === 'completed' && existing.status !== 'completed'

  const [project] = await db.update(schema.projects).set({
    ...body,
    favourite: body.favourite != null ? (body.favourite ? 1 : 0) : undefined,
    updatedAt: now,
    completedAt: completing ? now : body.completedAt,
    startedAt: body.startedAt ?? (completing && !existing.startedAt ? now : existing.startedAt)
  }).where(and(eq(schema.projects.id, id), eq(schema.projects.userId, user.id))).returning()

  if (completing) {
    await consumeProjectSupplies(id)
  }

  return project
})
