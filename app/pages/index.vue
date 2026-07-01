<script setup lang="ts">
definePageMeta({ layout: 'landing' })

const { user } = useUserSession()

const features = [
  {
    icon: 'i-lucide-package',
    color: 'text-calico-500',
    title: 'Know what you have',
    description: 'Track fabric, thread, batting, and tools across your stash. We nudge you when something runs low.'
  },
  {
    icon: 'i-lucide-folder-kanban',
    color: 'text-meadow-600',
    title: 'Plan with intention',
    description: 'Move projects from planning to in-progress to done, and tie the supplies each piece calls for.'
  },
  {
    icon: 'i-lucide-bookmark',
    color: 'text-marigold-500',
    title: 'Save the spark',
    description: 'Keep patterns, tutorials, and inspiration one tap away, ready whenever creativity strikes.'
  }
]

const steps = [
  {
    title: 'Track your supplies',
    description: 'Add your fabric, thread, and tools. Quiltly watches the quantities so your stash never surprises you.'
  },
  {
    title: 'Plan your projects',
    description: 'Start a project, attach the supplies it calls for, and follow its progress from first cut to final stitch.'
  },
  {
    title: 'Save your inspiration',
    description: 'Bookmark the patterns and tutorials you love, and come back to them the moment you need a spark.'
  }
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <UContainer class="py-20 md:py-28 flex flex-col items-center text-center gap-6">
        <LandingPatch size="lg" />

        <h1 class="font-display text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl leading-[1.1]">
          Where your next quilt takes shape.
        </h1>

        <p class="text-lg text-muted max-w-xl">
          Quiltly brings your fabric stash, works-in-progress, and favorite patterns together — so you can spend less time hunting and more time stitching.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <template v-if="user">
            <UButton
              to="/dashboard"
              size="lg"
              label="Go to dashboard"
              trailing-icon="i-lucide-arrow-right"
            />
          </template>
          <template v-else>
            <UButton
              to="/login?mode=register"
              size="lg"
              label="Get started"
              trailing-icon="i-lucide-arrow-right"
            />
            <UButton
              to="/login"
              size="lg"
              color="neutral"
              variant="subtle"
              label="Sign in"
            />
          </template>
        </div>
      </UContainer>
    </section>

    <!-- Features -->
    <section class="border-t border-muted">
      <UContainer class="py-16 md:py-20">
        <div class="text-center mb-12">
          <h2 class="font-display text-3xl font-semibold tracking-tight">
            Everything for your quilting practice
          </h2>
          <p class="text-muted mt-2">
            One calm, organized home for your supplies, projects, and inspiration.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-5">
          <UCard
            v-for="feature in features"
            :key="feature.title"
          >
            <div class="flex flex-col gap-3">
              <UIcon
                :name="feature.icon"
                :class="['size-7', feature.color]"
              />
              <h3 class="font-semibold text-lg">
                {{ feature.title }}
              </h3>
              <p class="text-sm text-muted">
                {{ feature.description }}
              </p>
            </div>
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- How it works -->
    <section class="border-t border-muted bg-muted/40">
      <UContainer class="py-16 md:py-20">
        <div class="text-center mb-12">
          <h2 class="font-display text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <p class="text-muted mt-2">
            Three simple steps from stash to finished quilt.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-5">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="flex flex-col gap-3 p-5"
          >
            <span class="font-display text-4xl font-semibold text-primary/70">
              {{ i + 1 }}
            </span>
            <h3 class="font-semibold text-lg">
              {{ step.title }}
            </h3>
            <p class="text-sm text-muted">
              {{ step.description }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Closing CTA -->
    <section class="border-t border-muted">
      <UContainer class="py-16 md:py-20 text-center flex flex-col items-center gap-5">
        <h2 class="font-display text-3xl md:text-4xl font-semibold tracking-tight max-w-xl">
          Ready to piece it all together?
        </h2>
        <p class="text-muted max-w-md">
          Start your free account and organize your quilting workspace in minutes.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-1">
          <UButton
            v-if="user"
            to="/dashboard"
            size="lg"
            label="Go to dashboard"
            trailing-icon="i-lucide-arrow-right"
          />
          <template v-else>
            <UButton
              to="/login?mode=register"
              size="lg"
              label="Get started"
              trailing-icon="i-lucide-arrow-right"
            />
            <UButton
              to="/login"
              size="lg"
              color="neutral"
              variant="subtle"
              label="Sign in"
            />
          </template>
        </div>
      </UContainer>
    </section>
  </div>
</template>
