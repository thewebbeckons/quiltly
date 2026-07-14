<script setup lang="ts">
const { user } = useUserSession()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default text-default paper-noise">
    <UHeader
      :toggle="false"
      class="mx-3 mt-3 rounded-[3px]"
    >
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-3"
        >
          <LandingPatch size="sm" />
          <span class="font-display text-xl font-medium tracking-[-0.04em]">Quiltly</span>
        </NuxtLink>
      </template>

      <nav class="hidden md:flex items-center gap-8 font-mono text-xs text-muted">
        <NuxtLink
          to="/#practice"
          class="transition-colors hover:text-highlighted"
        >
          Practice
        </NuxtLink>
        <NuxtLink
          to="/#process"
          class="transition-colors hover:text-highlighted"
        >
          Process
        </NuxtLink>
      </nav>

      <template #right>
        <UButton
          v-if="user"
          to="/dashboard"
          label="Go to dashboard"
          trailing-icon="i-lucide-arrow-right"
        />
        <template v-else>
          <UButton
            to="/login"
            label="Sign in"
            color="neutral"
            variant="ghost"
            class="hidden sm:inline-flex"
          />
          <UButton
            to="/login?mode=register"
            label="Get started"
            trailing-icon="i-lucide-arrow-right"
          />
        </template>
      </template>
    </UHeader>

    <UMain class="flex-1">
      <slot />
    </UMain>

    <footer class="section-rule py-14 mt-0 bg-elevated/45">
      <UContainer class="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div class="max-w-lg">
          <div class="flex items-center gap-3 mb-4">
            <LandingPatch size="sm" />
            <span class="font-display text-2xl font-medium tracking-[-0.04em]">Quiltly</span>
          </div>
          <p class="text-lg text-muted leading-relaxed">
            Track your quilting supplies, projects, and inspiration — all in one place.
          </p>
        </div>
        <p class="editorial-label text-muted">
          Made for thoughtful making
        </p>
      </UContainer>
    </footer>
  </div>
</template>
