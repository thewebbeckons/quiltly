<script setup lang="ts">
const { data: stats } = await useFetch('/api/stats')

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
  <UContainer class="py-6 space-y-6">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold">
          Dashboard
        </h1>
        <p class="text-muted text-sm">
          An overview of your quilting workspace
        </p>
      </div>
      <UDropdownMenu
        :items="createItems"
        :content="{ align: 'end' }"
      >
        <UButton
          icon="i-lucide-plus"
          label="Create"
          trailing-icon="i-lucide-chevron-down"
        />
      </UDropdownMenu>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <UCard
        v-for="card in statCards"
        :key="card.label"
        class="text-center"
      >
        <div class="flex flex-col items-center gap-1">
          <UIcon
            :name="card.icon"
            :class="['size-6', card.color]"
          />
          <span class="text-2xl font-bold">{{ card.value }}</span>
          <span class="text-xs text-muted">{{ card.label }}</span>
        </div>
      </UCard>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold flex items-center gap-2">
              <UIcon
                name="i-lucide-triangle-alert"
                class="text-warning"
              />
              Low stock
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
          class="text-sm text-muted py-4 text-center"
        >
          Everything is well stocked.
        </div>
        <ul
          v-else
          class="space-y-2"
        >
          <li
            v-for="item in stats.lowStock"
            :key="item.id"
            class="flex items-center justify-between text-sm"
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

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold flex items-center gap-2">
              <UIcon
                name="i-lucide-bookmark"
                class="text-primary"
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
          class="text-sm text-muted py-4 text-center"
        >
          No bookmarks yet.
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

    <UCard>
      <template #header>
        <h2 class="font-semibold flex items-center gap-2">
          <UIcon
            name="i-lucide-package"
            class="text-primary"
          />
          Supplies by type
        </h2>
      </template>
      <div
        v-if="!stats?.suppliesByType?.length"
        class="text-sm text-muted py-4 text-center"
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
