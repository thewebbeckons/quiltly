import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const projectId = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(projectId)) throw createError({ statusCode: 400, statusMessage: 'Invalid project id' })

  const [project] = await db.select({ id: schema.projects.id }).from(schema.projects)
    .where(and(eq(schema.projects.id, projectId), eq(schema.projects.userId, user.id)))
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const body = await readValidatedBody(event, projectSupplySchema.parse)

  const [supply] = await db.select({ id: schema.supplies.id }).from(schema.supplies)
    .where(and(eq(schema.supplies.id, body.supplyId), eq(schema.supplies.userId, user.id)))
  if (!supply) throw createError({ statusCode: 404, statusMessage: 'Supply not found' })

  const [link] = await db.insert(schema.projectSupplies).values({
    projectId,
    supplyId: body.supplyId,
    quantityUsed: body.quantityUsed,
    unit: body.unit,
    notes: body.notes,
    createdAt: new Date()
  }).onConflictDoUpdate({
    target: [schema.projectSupplies.projectId, schema.projectSupplies.supplyId],
    set: {
      quantityUsed: body.quantityUsed,
      unit: body.unit,
      notes: body.notes
    }
  }).returning()

  return link
})
