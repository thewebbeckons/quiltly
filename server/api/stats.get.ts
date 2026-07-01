import { and, count, desc, eq, gte, lte } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [activeProjects] = await db.select({ value: count() }).from(schema.projects)
    .where(and(eq(schema.projects.userId, user.id), eq(schema.projects.status, 'in_progress')))
  const [planningProjects] = await db.select({ value: count() }).from(schema.projects)
    .where(and(eq(schema.projects.userId, user.id), eq(schema.projects.status, 'planning')))
  const [completedThisMonth] = await db.select({ value: count() }).from(schema.projects)
    .where(and(eq(schema.projects.userId, user.id), eq(schema.projects.status, 'completed'), gte(schema.projects.completedAt, monthStart)))

  const lowStock = await db.select().from(schema.supplies)
    .where(and(eq(schema.supplies.userId, user.id), lte(schema.supplies.quantity, schema.supplies.lowStockThreshold)))
    .orderBy(schema.supplies.name)

  const recentBookmarks = await db.select().from(schema.bookmarks)
    .where(eq(schema.bookmarks.userId, user.id))
    .orderBy(desc(schema.bookmarks.createdAt))
    .limit(5)

  const suppliesByType = await db.select({
    type: schema.supplies.type,
    value: count()
  }).from(schema.supplies)
    .where(eq(schema.supplies.userId, user.id))
    .groupBy(schema.supplies.type)

  return {
    activeProjects: activeProjects?.value ?? 0,
    planningProjects: planningProjects?.value ?? 0,
    completedThisMonth: completedThisMonth?.value ?? 0,
    lowStock,
    recentBookmarks,
    suppliesByType
  }
})
