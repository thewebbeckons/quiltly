import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readValidatedBody(event, supplyCreateSchema.parse)

  const now = new Date()
  const [supply] = await db.insert(schema.supplies).values({
    userId: user.id,
    name: body.name,
    type: body.type,
    quantity: body.quantity ?? 0,
    unit: body.unit,
    color: body.color,
    lowStockThreshold: body.lowStockThreshold ?? 1,
    metadata: body.metadata,
    notes: body.notes,
    imagePath: body.imagePath,
    createdAt: now,
    updatedAt: now
  }).returning()

  return supply
})
