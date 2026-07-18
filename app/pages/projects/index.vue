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
  <UContainer class="space-y-8 pb-10">
    <AppPageHeader
      eyebrow="Your cutting table"
      title="Move quilts from first idea to final stitch."
      description="Keep patterns, notes, materials, and progress together while each piece takes shape."
      icon="i-lucide-folder-kanban"
      tone="sky"
      :meta="`${projects?.length ?? 0} ${projects?.length === 1 ? 'project' : 'projects'} in your workspace`"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Start a project"
          @click="openCreate"
        />
      </template>
    </AppPageHeader>

    <div class="app-toolbar">
      <div>
        <p class="editorial-label text-toned">
          Project ledger
        </p>
        <p class="mt-2 text-sm text-muted">
          Follow work from planning through completion.
        </p>
      </div>
      <USelect
        v-model="statusFilter"
        :items="statusOptions"
        aria-label="Filter projects by status"
        class="w-full sm:w-52"
      />
    </div>

    <AppEmptyState
      v-if="!projects?.length"
      icon="i-lucide-folder-kanban"
      eyebrow="A clear cutting table"
      title="Give the next quilt a place to begin."
      description="Start with a name and a pattern. You can connect supplies and add notes as the project grows."
    >
      <UButton
        label="Start a project"
        icon="i-lucide-plus"
        @click="openCreate"
      />
    </AppEmptyState>

    <div
      v-else
      class="space-y-9"
    >
      <section v-if="favourites.length">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="app-section-heading">
            <UIcon
              name="i-lucide-pin"
              class="size-3.5 text-primary"
            />
            Pinned to the wall
          </h2>
          <span class="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-dimmed">{{ favourites.length }} favorites</span>
        </div>
        <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li
            v-for="project in favourites"
            :key="project.id"
          >
            <ProjectCard
              :project="project"
              @toggle-favourite="toggleFavourite"
              @edit="openEdit"
              @remove="remove"
            />
          </li>
        </ul>
      </section>

      <section v-if="rest.length">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="app-section-heading">
            <UIcon
              name="i-lucide-layers-3"
              class="size-3.5 text-primary"
            />
            {{ favourites.length ? 'All other projects' : 'On the cutting table' }}
          </h2>
          <span class="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-dimmed">{{ rest.length }} shown</span>
        </div>
        <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li
            v-for="project in rest"
            :key="project.id"
          >
            <ProjectCard
              :project="project"
              @toggle-favourite="toggleFavourite"
              @edit="openEdit"
              @remove="remove"
            />
          </li>
        </ul>
      </section>
    </div>
    <UModal
      v-model:open="modalOpen"
      :title="editing ? 'Edit project' : 'New project'"
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
