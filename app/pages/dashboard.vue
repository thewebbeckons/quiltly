<script setup lang="ts">
const { user } = useUserSession()
const { data: stats } = await useFetch('/api/stats')

const firstName = computed(() => user.value?.name?.trim().split(/\s+/)[0] || 'there')

const statCards = computed(() => [
  { label: 'Active projects', value: stats.value?.activeProjects ?? 0, icon: 'i-lucide-circle-play', color: 'text-primary' },
  { label: 'Planning', value: stats.value?.planningProjects ?? 0, icon: 'i-lucide-pencil-ruler', color: 'text-info' },
  { label: 'Completed this month', value: stats.value?.completedThisMonth ?? 0, icon: 'i-lucide-party-popper', color: 'text-success' }
])

const createItems = [
  { label: 'New project', icon: 'i-lucide-folder-kanban', to: '/projects?new=1' },
  { label: 'Add supply', icon: 'i-lucide-package', to: '/supplies?new=1' },
  { label: 'Save bookmark', icon: 'i-lucide-bookmark', to: '/bookmarks?new=1' }
]
</script>

<template>
  <UContainer class="space-y-8 pb-10">
    <AppPageHeader
      eyebrow="Your quilting workspace"
      :title="`Hi ${firstName}. Keep the whole quilt in view.`"
      description="See what is in motion, what needs attention, and where inspiration is waiting."
      icon="i-lucide-layout-dashboard"
      tone="calico"
      meta="Workspace overview"
    >
      <template #actions>
        <UDropdownMenu
          :items="createItems"
          :content="{ align: 'start' }"
        >
          <UButton
            icon="i-lucide-plus"
            label="Create something"
            trailing-icon="i-lucide-chevron-down"
          />
        </UDropdownMenu>
      </template>
    </AppPageHeader>

    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="app-section-heading">
          <UIcon
            name="i-lucide-ruler"
            class="size-3.5 text-primary"
          />
          On the cutting table
        </h2>
        <span class="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-dimmed">Right now</span>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <UCard
          v-for="(card, index) in statCards"
          :key="card.label"
          :ui="{ body: 'p-5 sm:p-6' }"
          class="app-card"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="font-display text-5xl font-medium leading-none tracking-[-0.055em] text-highlighted">{{ card.value }}</span>
              <p class="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted">
                {{ card.label }}
              </p>
            </div>
            <div class="flex size-11 items-center justify-center rounded-full bg-muted/75">
              <UIcon
                :name="card.icon"
                :class="['size-5', card.color]"
              />
            </div>
          </div>
          <div
            class="mt-5 h-1"
            :class="index === 0 ? 'bg-calico-300' : index === 1 ? 'bg-sky-300' : 'bg-meadow-300'"
          />
        </UCard>
      </div>
    </section>

    <div class="grid gap-4 md:grid-cols-2">
      <UCard class="app-card">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-2xl text-highlighted">
              <UIcon
                name="i-lucide-triangle-alert"
                class="size-5 text-warning"
              />
              Low-stock notes
            </h2>
            <UButton
              to="/supplies"
              label="View all"
              variant="link"
              size="xs"
              trailing-icon="i-lucide-arrow-right"
            />
          </div>
        </template>

        <div
          v-if="!stats?.lowStock?.length"
          class="flex items-center gap-3 py-3 text-sm text-muted"
        >
          <span class="flex size-9 items-center justify-center rounded-full bg-meadow-100 text-meadow-700">
            <UIcon name="i-lucide-check" />
          </span>
          Everything is well stocked. Your stash is ready.
        </div>
        <ul
          v-else
          class="space-y-2"
        >
          <li
            v-for="item in stats.lowStock"
            :key="item.id"
            class="flex items-center justify-between gap-3 border-b border-dashed border-default py-2 text-sm last:border-0"
          >
            <span class="flex items-center gap-2">
              <UIcon
                name="i-lucide-package"
                class="text-muted"
              />
              {{ item.name }}
              <UBadge
                :label="formatEnum(item.type)"
                size="sm"
                variant="subtle"
              />
            </span>
            <span class="text-muted">{{ item.quantity }} {{ item.unit }}</span>
          </li>
        </ul>
      </UCard>

      <UCard class="app-card">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="flex items-center gap-2 text-2xl text-highlighted">
              <UIcon
                name="i-lucide-bookmark"
                class="size-5 text-primary"
              />
              Recent inspiration
            </h2>
            <UButton
              to="/bookmarks"
              label="View all"
              variant="link"
              size="xs"
              trailing-icon="i-lucide-arrow-right"
            />
          </div>
        </template>

        <div
          v-if="!stats?.recentBookmarks?.length"
          class="flex items-center gap-3 py-3 text-sm text-muted"
        >
          <span class="flex size-9 items-center justify-center rounded-full bg-petal-100 text-petal-700">
            <UIcon name="i-lucide-bookmark-plus" />
          </span>
          Save a pattern or color story to start your inspiration board.
        </div>
        <ul
          v-else
          class="space-y-2"
        >
          <li
            v-for="bookmark in stats.recentBookmarks"
            :key="bookmark.id"
          >
            <UButton
              :to="bookmark.url"
              target="_blank"
              variant="ghost"
              color="neutral"
              class="w-full justify-start px-0"
              :label="bookmark.title || bookmark.url"
              size="sm"
              trailing-icon="i-lucide-external-link"
            />
          </li>
        </ul>
      </UCard>
    </div>

    <UCard class="app-card">
      <template #header>
        <h2 class="flex items-center gap-2 text-2xl text-highlighted">
          <UIcon
            name="i-lucide-package"
            class="size-5 text-primary"
          />
          Supplies by type
        </h2>
      </template>
      <div
        v-if="!stats?.suppliesByType?.length"
        class="text-sm text-muted py-3"
      >
        Add supplies to see a breakdown.
      </div>
      <div
        v-else
        class="flex flex-wrap gap-2"
      >
        <UBadge
          v-for="group in stats.suppliesByType"
          :key="group.type"
          :label="`${formatEnum(group.type)}: ${group.value}`"
          variant="subtle"
          size="lg"
        />
      </div>
    </UCard>
  </UContainer>
</template>
