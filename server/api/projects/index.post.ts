import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readValidatedBody(event, projectCreateSchema.parse)

  const now = new Date()
  const [project] = await db.insert(schema.projects).values({
    userId: user.id,
    name: body.name,
    status: body.status,
    patternSource: body.patternSource,
    dueDate: body.dueDate,
    notes: body.notes,
    imagePath: body.imagePath,
    startedAt: body.startedAt,
    createdAt: now,
    updatedAt: now
  }).returning()

  return project
})
