import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const [project] = await db.select().from(schema.projects)
    .where(and(eq(schema.projects.id, id), eq(schema.projects.userId, user.id)))
  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

  const supplies = await db.select({
    id: schema.projectSupplies.id,
    supplyId: schema.projectSupplies.supplyId,
    quantityUsed: schema.projectSupplies.quantityUsed,
    unit: schema.projectSupplies.unit,
    consumed: schema.projectSupplies.consumed,
    consumedAt: schema.projectSupplies.consumedAt,
    notes: schema.projectSupplies.notes,
    name: schema.supplies.name,
    type: schema.supplies.type,
    supplyQuantity: schema.supplies.quantity,
    supplyUnit: schema.supplies.unit
  }).from(schema.projectSupplies)
    .innerJoin(schema.supplies, eq(schema.projectSupplies.supplyId, schema.supplies.id))
    .where(eq(schema.projectSupplies.projectId, id))

  return { ...project, supplies }
})
