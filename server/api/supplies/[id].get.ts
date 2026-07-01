import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })

  const [supply] = await db.select().from(schema.supplies)
    .where(and(eq(schema.supplies.id, id), eq(schema.supplies.userId, user.id)))

  if (!supply) throw createError({ statusCode: 404, statusMessage: 'Supply not found' })
  return supply
})
