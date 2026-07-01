<script setup lang="ts">
const { user } = useUserSession()

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap' }
  ]
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default text-default">
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 font-semibold"
        >
          <LandingPatch size="sm" />
          <span>Quiltly</span>
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
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

    <footer class="border-t border-muted py-10 mt-12">
      <UContainer class="flex flex-col items-center gap-3 text-center">
        <div class="flex items-center gap-2.5 font-semibold">
          <LandingPatch size="sm" />
          <span>Quiltly</span>
        </div>
        <p class="text-sm text-muted">
          Track your quilting supplies, projects, and inspiration — all in one place.
        </p>
      </UContainer>
    </footer>
  </div>
</template>
