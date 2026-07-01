import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const body = await readValidatedBody(event, supplyPatchSchema.parse)
  const [supply] = await db.update(schema.supplies).set({
    ...body,
    updatedAt: new Date()
  }).where(and(eq(schema.supplies.id, id), eq(schema.supplies.userId, user.id))).returning()

  if (!supply) throw createError({ statusCode: 404, statusMessage: 'Supply not found' })
  return supply
})
