import { db, schema } from 'hub:db'

const CURRENT_ONBOARDING_VERSION = 1

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const now = new Date()

  await db.insert(schema.userPreferences).values({
    userId: user.id,
    onboardingVersion: CURRENT_ONBOARDING_VERSION,
    onboardingCompletedAt: now,
    createdAt: now,
    updatedAt: now
  }).onConflictDoUpdate({
    target: schema.userPreferences.userId,
    set: {
      onboardingVersion: CURRENT_ONBOARDING_VERSION,
      onboardingCompletedAt: now,
      updatedAt: now
    }
  })

  return {
    completed: true,
    version: CURRENT_ONBOARDING_VERSION,
    completedAt: now
  }
})
