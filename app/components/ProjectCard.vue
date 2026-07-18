<script setup lang="ts">
import type { Project } from '~~/shared/types/db'
import type { ProjectStatus } from '~~/shared/types/enums'

defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  toggleFavourite: [project: Project]
  edit: [project: Project]
  remove: [project: Project]
}>()

const statusColor: Record<ProjectStatus, 'neutral' | 'primary' | 'warning' | 'success' | 'info'> = {
  planning: 'info',
  in_progress: 'primary',
  paused: 'warning',
  completed: 'success',
  archived: 'neutral'
}

const statusTone: Record<ProjectStatus, string> = {
  planning: 'bg-sky-100 text-sky-700',
  in_progress: 'bg-calico-100 text-calico-700',
  paused: 'bg-marigold-100 text-marigold-700',
  completed: 'bg-meadow-100 text-meadow-700',
  archived: 'bg-muslin-200 text-muslin-700'
}
</script>

<template>
  <UCard
    :ui="{ body: 'p-5 sm:p-5' }"
    class="app-card relative h-full"
  >
    <NuxtLink
      :to="`/projects/${project.id}`"
      :aria-label="`Open ${project.name}`"
      class="absolute inset-0 z-0 rounded-[2px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
    />
    <div class="pointer-events-none relative z-10 flex h-full flex-col gap-4">
      <div class="flex items-start justify-between gap-3">
        <div
          class="flex size-11 shrink-0 items-center justify-center rounded-full"
          :class="statusTone[project.status]"
        >
          <UIcon
            :name="project.favourite ? 'i-lucide-pin' : 'i-lucide-folder-kanban'"
            class="size-5"
          />
        </div>
        <UBadge
          :label="formatEnum(project.status)"
          :color="statusColor[project.status]"
          variant="subtle"
          size="sm"
          class="shrink-0"
        />
      </div>

      <div>
        <h3 class="line-clamp-2 font-display text-2xl font-medium leading-7 tracking-[-0.035em] text-highlighted">
          {{ project.name }}
        </h3>
        <p
          v-if="project.patternSource"
          class="mt-2 line-clamp-2 text-sm leading-5 text-muted"
        >
          {{ project.patternSource }}
        </p>
        <p
          v-else
          class="mt-2 text-sm italic text-muted/60"
        >
          Pattern source not added
        </p>
      </div>

      <div class="pointer-events-auto mt-auto flex items-center justify-between border-t border-dashed border-default pt-3">
        <UButton
          :icon="project.favourite ? 'i-lucide-pin-off' : 'i-lucide-pin'"
          :aria-label="project.favourite ? 'Unpin project' : 'Pin project'"
          :color="project.favourite ? 'primary' : 'neutral'"
          variant="ghost"
          size="xs"
          @click.stop="emit('toggleFavourite', project)"
        />
        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-pencil"
            aria-label="Edit project"
            variant="ghost"
            color="neutral"
            size="xs"
            @click.stop="emit('edit', project)"
          />
          <UButton
            icon="i-lucide-trash-2"
            aria-label="Delete project"
            variant="ghost"
            color="error"
            size="xs"
            @click.stop="emit('remove', project)"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>
