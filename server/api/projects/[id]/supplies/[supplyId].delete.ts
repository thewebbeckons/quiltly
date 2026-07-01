import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const projectId = Number(getRouterParam(event, 'id'))
  const supplyId = Number(getRouterParam(event, 'supplyId'))
  if (!Number.isFinite(projectId) || !Number.isFinite(supplyId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  }

  const [project] = await db.select({ id: schema.projects.id }).from(schema.projects)
    .where(and(eq(schema.projects.id, projectId), eq(schema.projects.userId, user.id)))
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  await db.delete(schema.projectSupplies)
    .where(and(eq(schema.projectSupplies.projectId, projectId), eq(schema.projectSupplies.supplyId, supplyId)))

  return { success: true }
})
