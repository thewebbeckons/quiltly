<script setup lang="ts">
import { z } from 'zod'
import type { Project } from '~~/shared/types/db'
import type { ProjectStatus } from '~~/shared/types/enums'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { PROJECT_STATUSES } = await import('~~/shared/types/enums')

const ALL_STATUSES = 'all' as const
const statusFilter = ref<ProjectStatus | typeof ALL_STATUSES>(ALL_STATUSES)
const statusQuery = computed(() => statusFilter.value === ALL_STATUSES ? undefined : statusFilter.value)
const { data: projects, refresh } = await useFetch<Project[]>('/api/projects', {
  query: { status: statusQuery },
  default: () => []
})

const statusOptions = [
  { label: 'All statuses', value: ALL_STATUSES },
  ...PROJECT_STATUSES.map(s => ({ label: formatEnum(s), value: s }))
]

const statusItems = PROJECT_STATUSES.map(s => ({ label: formatEnum(s), value: s }))

const statusColor: Record<ProjectStatus, 'neutral' | 'primary' | 'warning' | 'success' | 'info'> = {
  planning: 'info',
  in_progress: 'primary',
  paused: 'warning',
  completed: 'success',
  archived: 'neutral'
}

const modalOpen = ref(false)
const editing = ref<Project | null>(null)
const saving = ref(false)

const empty = () => ({
  name: '',
  status: 'planning' as ProjectStatus,
  patternSource: '',
  notes: ''
})
const state = reactive(empty())

const schema = z.object({
  name: z.string().min(1, 'Required'),
  status: z.string().min(1),
  patternSource: z.string().optional(),
  notes: z.string().optional()
})

function openCreate() {
  editing.value = null
  Object.assign(state, empty())
  modalOpen.value = true
}

onMounted(() => {
  if (route.query.new === '1') {
    openCreate()
    router.replace({ query: {} })
  }
})

function openEdit(project: Project) {
  editing.value = project
  Object.assign(state, {
    name: project.name,
    status: project.status,
    patternSource: project.patternSource ?? '',
    notes: project.notes ?? ''
  })
  modalOpen.value = true
}

async function onSubmit() {
  saving.value = true
  const payload = {
    ...state,
    patternSource: state.patternSource || undefined,
    notes: state.notes || undefined
  }
  try {
    if (editing.value) {
      await $fetch(`/api/projects/${editing.value.id}`, { method: 'PATCH', body: payload })
      toast.add({ title: 'Project updated', color: 'success' })
    } else {
      await $fetch('/api/projects', { method: 'POST', body: payload })
      toast.add({ title: 'Project created', color: 'success' })
    }
    modalOpen.value = false
    await refresh()
  } catch (e) {
    toast.add({ title: 'Save failed', description: (e as Error).message, color: 'error' })
  } finally {
    saving.value = false
  }
}

async function toggleFavourite(project: Project) {
  try {
    await $fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      body: { favourite: !project.favourite }
    })
    await refresh()
  } catch (e) {
    toast.add({ title: 'Failed to update', description: (e as Error).message, color: 'error' })
  }
}

const favourites = computed(() => (projects.value ?? []).filter(p => p.favourite))
const rest = computed(() => (projects.value ?? []).filter(p => !p.favourite))

async function remove(project: Project) {
  try {
    await $fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
    toast.add({ title: 'Project removed', color: 'success' })
    await refresh()
  } catch (e) {
    toast.add({ title: 'Delete failed', description: (e as Error).message, color: 'error' })
  }
}
</script>

<template>
  <UContainer class="py-6 space-y-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold">
          Projects
        </h1>
        <p class="text-muted text-sm">
          {{ projects?.length }} project{{ projects?.length === 1 ? '' : 's' }}
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="New"
        @click="openCreate"
      />
    </div>

    <USelect
      v-model="statusFilter"
      :items="statusOptions"
      class="w-full max-w-48"
    />

    <div
      v-if="!projects?.length"
      class="text-center py-16 text-muted"
    >
      <UIcon
        name="i-lucide-folder-kanban"
        class="size-10 mx-auto mb-3 opacity-50"
      />
      <p>No projects yet.</p>
      <UButton
        label="Start a project"
        variant="link"
        @click="openCreate"
      />
    </div>

    <ul
      v-else
      class="space-y-6"
    >
      <template v-if="favourites.length">
        <li>
          <h2 class="text-sm font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5">
            <UIcon
              name="i-lucide-pin"
              class="text-primary size-3.5"
            />
            Pinned
          </h2>
        </li>
        <li>
          <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <li
              v-for="project in favourites"
              :key="project.id"
            >
              <UCard
                :ui="{ body: 'p-4 sm:p-4' }"
                class="relative h-full transition-shadow hover:shadow-lg"
              >
                <NuxtLink
                  :to="`/projects/${project.id}`"
                  :aria-label="`Open ${project.name}`"
                  class="absolute inset-0 z-0 rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
                />
                <div class="relative z-10 flex flex-col gap-3 h-full pointer-events-none">
                  <div class="flex items-start justify-between gap-2">
                    <span class="font-medium leading-snug line-clamp-2">{{ project.name }}</span>
                    <UBadge
                      :label="formatEnum(project.status)"
                      :color="statusColor[project.status]"
                      variant="subtle"
                      size="sm"
                      class="shrink-0"
                    />
                  </div>
                  <p
                    v-if="project.patternSource"
                    class="text-sm text-muted line-clamp-2 mt-auto"
                  >
                    {{ project.patternSource }}
                  </p>
                  <div
                    v-else
                    class="text-sm text-muted/60 italic mt-auto"
                  >
                    No pattern source
                  </div>
                  <div class="flex items-center gap-1 shrink-0 pt-3 border-t border-muted/50 pointer-events-auto">
                    <UButton
                      icon="i-lucide-pin"
                      variant="ghost"
                      color="primary"
                      size="xs"
                      @click.stop="toggleFavourite(project)"
                    />
                    <UButton
                      icon="i-lucide-pencil"
                      variant="ghost"
                      color="neutral"
                      size="xs"
                      @click.stop="openEdit(project)"
                    />
                    <UButton
                      icon="i-lucide-trash-2"
                      variant="ghost"
                      color="error"
                      size="xs"
                      @click.stop="remove(project)"
                    />
                  </div>
                </div>
              </UCard>
            </li>
          </ul>
        </li>
      </template>

      <template v-if="favourites.length && rest.length">
        <li>
          <h2 class="text-sm font-semibold text-muted uppercase tracking-wider">
            All projects
          </h2>
        </li>
      </template>

      <li>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <li
            v-for="project in rest"
            :key="project.id"
          >
            <UCard
              :ui="{ body: 'p-4 sm:p-4' }"
              class="relative h-full transition-shadow hover:shadow-lg"
            >
              <NuxtLink
                :to="`/projects/${project.id}`"
                :aria-label="`Open ${project.name}`"
                class="absolute inset-0 z-0 rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
              />
              <div class="relative z-10 flex flex-col gap-3 h-full pointer-events-none">
                <div class="flex items-start justify-between gap-2">
                  <span class="font-medium leading-snug line-clamp-2">{{ project.name }}</span>
                  <UBadge
                    :label="formatEnum(project.status)"
                    :color="statusColor[project.status]"
                    variant="subtle"
                    size="sm"
                    class="shrink-0"
                  />
                </div>
                <p
                  v-if="project.patternSource"
                  class="text-sm text-muted line-clamp-2 mt-auto"
                >
                  {{ project.patternSource }}
                </p>
                <div
                  v-else
                  class="text-sm text-muted/60 italic mt-auto"
                >
                  No pattern source
                </div>
                <div class="flex items-center gap-1 shrink-0 pt-3 border-t border-muted/50 pointer-events-auto">
                  <UButton
                    icon="i-lucide-pin-off"
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    @click.stop="toggleFavourite(project)"
                  />
                  <UButton
                    icon="i-lucide-pencil"
                    variant="ghost"
                    color="neutral"
                    size="xs"
                    @click.stop="openEdit(project)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    variant="ghost"
                    color="error"
                    size="xs"
                    @click.stop="remove(project)"
                  />
                </div>
              </div>
            </UCard>
          </li>
        </ul>
      </li>
    </ul>
    <UModal
      v-model:open="modalOpen"
      :title="editing ? 'Edit Project' : 'New Project'"
      :description="editing ? 'Update the details of your project.' : 'Start tracking a new quilt project.'"
      :ui="{ content: 'sm:max-w-xl' }"
    >
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 sm:grid-cols-[1fr_10rem] gap-4">
            <UFormField
              name="name"
              label="Name"
              required
            >
              <UInput
                v-model="state.name"
                placeholder="Star quilt"
              />
            </UFormField>
            <UFormField
              name="status"
              label="Status"
            >
              <USelect
                v-model="state.status"
                :items="statusItems"
              />
            </UFormField>
          </div>
          <UFormField
            name="patternSource"
            label="Pattern source"
          >
            <UInput
              v-model="state.patternSource"
              placeholder="Pattern name or link"
            />
          </UFormField>
          <UFormField
            name="notes"
            label="Notes"
          >
            <UEditor
              v-model="state.notes"
              content-type="markdown"
              placeholder="Add any notes about this project..."
              :ui="{ content: 'min-h-40' }"
            >
              <template #default="{ editor }">
                <UEditorToolbar
                  :editor="editor"
                  :items="notesEditorItems"
                />
              </template>
            </UEditor>
          </UFormField>
          <div class="flex justify-end gap-2 pt-2">
            <UButton
              label="Cancel"
              variant="ghost"
              color="neutral"
              @click="modalOpen = false"
            />
            <UButton
              type="submit"
              :loading="saving"
              :label="editing ? 'Save changes' : 'Create project'"
            />
          </div>
        </UForm>
      </template>
    </UModal>
  </UContainer>
</template>
