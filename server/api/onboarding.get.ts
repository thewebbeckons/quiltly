import { eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'

const CURRENT_ONBOARDING_VERSION = 1

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const [preferences] = await db.select({
    version: schema.userPreferences.onboardingVersion,
    completedAt: schema.userPreferences.onboardingCompletedAt
  }).from(schema.userPreferences)
    .where(eq(schema.userPreferences.userId, user.id))
    .limit(1)

  return {
    completed: Boolean(
      preferences?.completedAt
      && preferences.version >= CURRENT_ONBOARDING_VERSION
    ),
    version: CURRENT_ONBOARDING_VERSION,
    completedAt: preferences?.completedAt ?? null
  }
})
