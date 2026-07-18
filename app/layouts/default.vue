<script setup lang="ts">
const { user, signOut } = useUserSession()
const route = useRoute()
const { open: onboardingOpen, show: showOnboardingTour } = useOnboardingTour()

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
  { label: 'Profile & settings', icon: 'i-lucide-user-round-cog', to: '/settings' },
  { label: 'View welcome tour', icon: 'i-lucide-sparkles', onSelect: showOnboardingTour },
  { type: 'separator' as const },
  { label: 'Sign out', icon: 'i-lucide-log-out', color: 'error' as const, onSelect: onSignOut }
])
</script>

<template>
  <div class="min-h-screen bg-default text-default paper-noise">
    <UHeader
      :toggle="false"
      class="mx-3 mt-3 rounded-[3px] ring-1 ring-default/55"
    >
      <template #left>
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-3"
        >
          <LandingPatch size="sm" />
          <span>
            <span class="block font-display text-xl font-medium leading-none tracking-[-0.04em]">Quiltly</span>
            <span class="mt-1 hidden font-mono text-[0.55rem] uppercase tracking-[0.12em] text-muted lg:block">The quilting workroom</span>
          </span>
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
          >
            <span class="hidden max-w-32 truncate text-xs sm:block">{{ user?.name || 'Account' }}</span>
          </UButton>
        </UDropdownMenu>
      </template>
    </UHeader>

    <UMain class="pt-4">
      <div class="app-content pb-24 md:pb-10">
        <slot />
      </div>
    </UMain>

    <nav class="fixed inset-x-3 bottom-3 z-50 rounded-[3px] bg-elevated/92 pb-[env(safe-area-inset-bottom)] shadow-[0_12px_40px_rgb(68_60_56_/_0.12)] ring-1 ring-default/70 backdrop-blur-xl md:hidden">
      <div class="grid grid-cols-4 gap-1 p-1">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="relative flex flex-col items-center gap-1 rounded-[2px] py-2 text-[0.65rem] font-medium transition-colors"
          :class="isActive(item.to) ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-muted/65 hover:text-highlighted'"
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
