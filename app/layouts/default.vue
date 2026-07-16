<script setup lang="ts">
const { user, signOut } = useUserSession()
const route = useRoute()
const onboardingOpen = ref(false)

const nav = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: 'Supplies', to: '/supplies', icon: 'i-lucide-package' },
  { label: 'Projects', to: '/projects', icon: 'i-lucide-folder-kanban' },
  { label: 'Bookmarks', to: '/bookmarks', icon: 'i-lucide-bookmark' }
]

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}

async function onSignOut() {
  await signOut()
}

const userMenu = computed(() => [
  { type: 'label' as const, label: user.value?.name || 'Account' },
  { type: 'label' as const, label: user.value?.email || '' },
  { type: 'separator' as const },
  { label: 'View welcome tour', icon: 'i-lucide-sparkles', onSelect: () => onboardingOpen.value = true },
  { type: 'separator' as const },
  { label: 'Sign out', icon: 'i-lucide-log-out', color: 'error' as const, onSelect: onSignOut }
])
</script>

<template>
  <div class="min-h-screen bg-default text-default paper-noise">
    <UHeader
      :toggle="false"
      class="mx-3 mt-3 rounded-[3px]"
    >
      <template #left>
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-3"
        >
          <LandingPatch size="sm" />
          <span class="font-display text-xl font-medium tracking-[-0.04em]">Quiltly</span>
        </NuxtLink>
      </template>

      <UNavigationMenu
        :items="nav"
        variant="link"
        class="hidden md:flex -mx-2"
      />

      <template #right>
        <UDropdownMenu
          :items="userMenu"
          :content="{ align: 'end' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-user"
            trailing-icon="i-lucide-chevron-down"
            aria-label="Open account menu"
          />
        </UDropdownMenu>
      </template>
    </UHeader>

    <UMain class="pt-4">
      <div class="app-content pb-24 md:pb-10">
        <slot />
      </div>
    </UMain>

    <nav class="md:hidden fixed bottom-3 inset-x-3 z-50 bg-elevated/92 backdrop-blur-xl rounded-[3px] pb-[env(safe-area-inset-bottom)] shadow-[0_12px_40px_rgb(68_60_56_/_0.12)]">
      <div class="grid grid-cols-4">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-1 py-2 text-xs font-medium"
          :class="isActive(item.to) ? 'text-primary' : 'text-muted'"
        >
          <UIcon
            :name="item.icon"
            class="size-5"
          />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <OnboardingTour v-model:open="onboardingOpen" />
  </div>
</template>
