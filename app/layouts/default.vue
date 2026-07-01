<script setup lang="ts">
const { user, signOut } = useUserSession()
const route = useRoute()

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
  { label: 'Sign out', icon: 'i-lucide-log-out', color: 'error' as const, onSelect: onSignOut }
])
</script>

<template>
  <div class="min-h-screen bg-default text-default">
    <UHeader>
      <template #left>
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-2.5 font-semibold"
        >
          <LandingPatch size="sm" />
          <span>Quiltly</span>
        </NuxtLink>
      </template>

      <UNavigationMenu
        :items="nav"
        variant="link"
        class="hidden md:flex -mx-2"
      />

      <template #right>
        <UColorModeButton />
        <UDropdownMenu
          :items="userMenu"
          :content="{ align: 'end' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-user"
            trailing-icon="i-lucide-chevron-down"
          />
        </UDropdownMenu>
      </template>
    </UHeader>

    <UMain>
      <div class="pb-20 md:pb-0">
        <slot />
      </div>
    </UMain>

    <nav class="md:hidden fixed bottom-0 inset-x-0 z-50 bg-default/82 backdrop-blur-md border-t border-muted pb-[env(safe-area-inset-bottom)]">
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
  </div>
</template>
