import { and, eq, sql } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export async function consumeProjectSupplies(projectId: number): Promise<void> {
  await db.transaction(async (tx) => {
    const pending = await tx.select().from(schema.projectSupplies)
      .where(and(
        eq(schema.projectSupplies.projectId, projectId),
        eq(schema.projectSupplies.consumed, false)
      ))

    if (pending.length === 0) return
    const now = new Date()

    for (const link of pending) {
      await tx.update(schema.supplies)
        .set({
          quantity: sql`MAX(${schema.supplies.quantity} - ${link.quantityUsed}, 0)`,
          updatedAt: now
        })
        .where(eq(schema.supplies.id, link.supplyId))

      await tx.update(schema.projectSupplies)
        .set({ consumed: true, consumedAt: now })
        .where(eq(schema.projectSupplies.id, link.id))
    }
  })
}
