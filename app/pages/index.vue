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
    <section class="relative overflow-hidden hero-wash min-h-[calc(100svh-6rem)] flex items-center">
      <div class="absolute top-16 left-[7%] opacity-35 -rotate-6 hidden lg:block">
        <LandingPatch size="md" />
      </div>
      <div class="absolute bottom-20 right-[8%] opacity-30 rotate-6 hidden lg:block">
        <LandingPatch size="md" />
      </div>

      <UContainer class="py-24 md:py-36 flex flex-col items-center text-center gap-7">
        <p class="editorial-label text-muted reveal-up">
          A considered home for your craft
        </p>

        <div
          class="reveal-up"
          style="animation-delay: 90ms"
        >
          <LandingPatch size="lg" />
        </div>

        <h1
          class="font-display text-5xl sm:text-6xl md:text-7xl font-medium tracking-[-0.055em] max-w-4xl leading-[0.94] reveal-up"
          style="animation-delay: 150ms"
        >
          Where your next quilt takes shape.
        </h1>

        <p
          class="text-xl md:text-2xl text-toned max-w-3xl leading-[1.35] reveal-up"
          style="animation-delay: 220ms"
        >
          Quiltly brings your fabric stash, works-in-progress, and favorite patterns together — so you can spend less time hunting and more time stitching.
        </p>

        <div
          class="flex flex-wrap items-center justify-center gap-3 pt-3 reveal-up"
          style="animation-delay: 290ms"
        >
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
    <section
      id="practice"
      class="section-rule bg-elevated/35 scroll-mt-24"
    >
      <UContainer class="py-20 md:py-28">
        <div class="grid md:grid-cols-[0.72fr_1.28fr] gap-8 md:gap-16 items-end mb-14 md:mb-20">
          <p class="editorial-label text-muted">
            Your quilting practice
          </p>
          <div>
            <h2 class="font-display text-4xl md:text-6xl font-medium tracking-[-0.05em] leading-[0.98]">
              Everything for your quilting practice
            </h2>
            <p class="text-xl text-muted mt-5 max-w-2xl leading-relaxed">
              One calm, organized home for your supplies, projects, and inspiration.
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-3">
          <UCard
            v-for="(feature, i) in features"
            :key="feature.title"
            :ui="{ body: 'p-0 sm:p-0' }"
            class="feature-card group ring-0 border-0 bg-elevated min-h-[23rem]"
          >
            <div class="h-44 flex items-center justify-center bg-muted/65 overflow-hidden relative">
              <div class="absolute inset-8 border border-default/70 rotate-3 transition-transform duration-500 group-hover:rotate-0" />
              <div class="size-24 bg-elevated/70 flex items-center justify-center rotate-[-3deg] transition-transform duration-500 group-hover:rotate-2">
                <UIcon
                  :name="feature.icon"
                  :class="['size-9', feature.color]"
                />
              </div>
            </div>
            <div class="flex flex-col gap-4 p-6 md:p-8">
              <span class="editorial-label text-muted">0{{ i + 1 }}</span>
              <h3 class="font-display font-medium text-3xl tracking-[-0.04em]">
                {{ feature.title }}
              </h3>
              <p class="text-lg text-muted leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- How it works -->
    <section
      id="process"
      class="section-rule scroll-mt-24"
    >
      <UContainer class="py-20 md:py-28">
        <div class="max-w-3xl mb-14 md:mb-20">
          <p class="editorial-label text-muted mb-6">
            A simple rhythm
          </p>
          <h2 class="font-display text-4xl md:text-6xl font-medium tracking-[-0.05em] leading-none">
            How it works
          </h2>
          <p class="text-xl text-muted mt-5">
            Three simple steps from stash to finished quilt.
          </p>
        </div>

        <div class="grid md:grid-cols-3 border-y border-default md:divide-x divide-default">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="flex flex-col gap-5 py-8 md:p-8 first:pl-0 last:pr-0 border-b md:border-b-0 last:border-b-0 border-default"
          >
            <span class="font-mono text-xs text-primary tracking-[0.12em]">
              Step 0{{ i + 1 }}
            </span>
            <h3 class="font-display font-medium text-3xl tracking-[-0.04em]">
              {{ step.title }}
            </h3>
            <p class="text-lg text-muted leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Closing CTA -->
    <section class="section-rule bg-muslin-900 text-muslin-50 overflow-hidden relative">
      <div class="absolute -top-12 right-0 opacity-20 rotate-12">
        <LandingPatch size="lg" />
      </div>
      <UContainer class="py-24 md:py-32 text-center flex flex-col items-center gap-6 relative">
        <p class="editorial-label text-muslin-300">
          Make room for making
        </p>
        <h2 class="font-display text-4xl md:text-6xl font-medium tracking-[-0.055em] leading-none max-w-3xl">
          Ready to piece it all together?
        </h2>
        <p class="text-xl text-muslin-300 max-w-xl leading-relaxed">
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
