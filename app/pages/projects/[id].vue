<script setup lang="ts">
import type { Supply } from '~~/shared/types/db'
import type { ProjectStatus } from '~~/shared/types/enums'

definePageMeta({
  key: route => route.params.id as string,
  auth: 'user'
})

const route = useRoute()
const toast = useToast()
const { PROJECT_STATUSES } = await import('~~/shared/types/enums')

const statusItems = PROJECT_STATUSES.map(s => ({ label: formatEnum(s), value: s }))

const id = computed(() => Number(route.params.id))
const projectUrl = computed(() => `/api/projects/${id.value}`)

interface ProjectDetail {
  id: number
  name: string
  status: ProjectStatus
  favourite: boolean
  patternSource: string | null
  notes: string | null
  startedAt: string | null
  completedAt: string | null
  supplies: Array<{
    id: number
    supplyId: number
    quantityUsed: number
    unit: string | null
    consumed: boolean
    notes: string | null
    name: string
    type: string
    supplyQuantity: number
    supplyUnit: string | null
  }>
}

const { data: project, error: projectError, refresh } = await useFetch<ProjectDetail>(projectUrl, {
  key: computed(() => `project-${id.value}`),
  watch: [id]
})
const { data: supplies, refresh: refreshSuppliesList } = await useFetch<Supply[]>('/api/supplies', { default: () => [] })

const statusColor: Record<ProjectStatus, 'neutral' | 'primary' | 'warning' | 'success' | 'info'> = {
  planning: 'info',
  in_progress: 'primary',
  paused: 'warning',
  completed: 'success',
  archived: 'neutral'
}

const statusSaving = ref(false)
async function onStatusChange(value: ProjectStatus) {
  if (!project.value) return
  statusSaving.value = true
  const wasCompleted = project.value.status === 'completed'
  try {
    await $fetch(`/api/projects/${project.value.id}`, { method: 'PATCH', body: { status: value } })
    if (value === 'completed' && !wasCompleted) {
      toast.add({ title: 'Project completed — inventory updated', color: 'success' })
    } else {
      toast.add({ title: 'Status updated', color: 'success' })
    }
    await refresh()
    await refreshSuppliesList()
  } catch (e) {
    toast.add({ title: 'Update failed', description: (e as Error).message, color: 'error' })
  } finally {
    statusSaving.value = false
  }
}

const linkModalOpen = ref(false)
const linkSaving = ref(false)
const linkState = reactive({
  supply: undefined as { label: string, value: number } | undefined,
  quantityUsed: 1,
  unit: '',
  notes: ''
})
const selectedSupplyId = computed(() => linkState.supply?.value)

async function addLink() {
  if (!project.value || !selectedSupplyId.value) return
  linkSaving.value = true
  try {
    await $fetch(`/api/projects/${project.value.id}/supplies`, {
      method: 'POST',
      body: {
        supplyId: selectedSupplyId.value,
        quantityUsed: linkState.quantityUsed,
        unit: linkState.unit || undefined,
        notes: linkState.notes || undefined
      }
    })
    toast.add({ title: 'Supply linked', color: 'success' })
    linkModalOpen.value = false
    linkState.supply = undefined
    linkState.quantityUsed = 1
    linkState.unit = ''
    linkState.notes = ''
    await refresh()
  } catch (e) {
    toast.add({ title: 'Link failed', description: (e as Error).message, color: 'error' })
  } finally {
    linkSaving.value = false
  }
}

async function removeLink(supplyId: number) {
  if (!project.value) return
  try {
    await $fetch(`/api/projects/${project.value.id}/supplies/${supplyId}`, { method: 'DELETE' })
    toast.add({ title: 'Supply unlinked', color: 'success' })
    await refresh()
  } catch (e) {
    toast.add({ title: 'Unlink failed', description: (e as Error).message, color: 'error' })
  }
}

async function toggleFavourite() {
  if (!project.value) return
  try {
    await $fetch(`/api/projects/${project.value.id}`, {
      method: 'PATCH',
      body: { favourite: !project.value.favourite }
    })
    await refresh()
  } catch (e) {
    toast.add({ title: 'Failed to update', description: (e as Error).message, color: 'error' })
  }
}

const availableSupplies = computed(() => {
  const linked = new Set(project.value?.supplies.map(s => s.supplyId) ?? [])
  return (supplies.value ?? []).filter(s => !linked.has(s.id))
})

const supplyItems = computed(() => availableSupplies.value.map(s => ({ label: s.name, value: s.id })))
</script>

<template>
  <UContainer class="py-6 space-y-4">
    <UButton
      to="/projects"
      icon="i-lucide-arrow-left"
      label="Projects"
      variant="ghost"
      color="neutral"
      size="sm"
      class="-ml-2"
    />

    <template v-if="projectError">
      <UCard>
        <div class="text-center py-8">
          <UIcon
            name="i-lucide-alert-circle"
            class="size-10 mx-auto mb-3 text-error"
          />
          <p class="font-medium">
            Project not found
          </p>
          <p class="text-sm text-muted mt-1">
            The project you're looking for doesn't exist or you don't have access.
          </p>
        </div>
      </UCard>
    </template>

    <template v-else-if="project">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h1 class="text-2xl font-semibold truncate flex items-center gap-2">
            {{ project.name }}
            <UButton
              :icon="project.favourite ? 'i-lucide-pin' : 'i-lucide-pin-off'"
              :color="project.favourite ? 'primary' : 'neutral'"
              variant="ghost"
              size="xs"
              @click="toggleFavourite"
            />
          </h1>
          <p
            v-if="project.patternSource"
            class="text-muted text-sm"
          >
            {{ project.patternSource }}
          </p>
        </div>
        <USelect
          :model-value="project.status"
          :items="statusItems"
          :loading="statusSaving"
          @update:model-value="onStatusChange"
        >
          <template #default>
            <UBadge
              :label="formatEnum(project.status)"
              :color="statusColor[project.status]"
              variant="subtle"
            />
          </template>
        </USelect>
      </div>

      <UCard v-if="project.notes">
        <p class="text-sm whitespace-pre-wrap">
          {{ project.notes }}
        </p>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold flex items-center gap-2">
              <UIcon
                name="i-lucide-package"
                class="text-primary"
              />
              Supplies used
            </h2>
            <UButton
              icon="i-lucide-plus"
              label="Link"
              size="xs"
              :disabled="!availableSupplies.length"
              @click="linkModalOpen = true"
            />
          </div>
        </template>

        <div
          v-if="!project.supplies.length"
          class="text-sm text-muted py-4 text-center"
        >
          No supplies linked yet.
        </div>
        <ul
          v-else
          class="space-y-2"
        >
          <li
            v-for="link in project.supplies"
            :key="link.id"
            class="flex items-center justify-between text-sm"
          >
            <span class="flex items-center gap-2 min-w-0">
              <UIcon
                name="i-lucide-package"
                class="text-muted shrink-0"
              />
              <span class="truncate">{{ link.name }}</span>
              <UBadge
                :label="formatEnum(link.type)"
                variant="subtle"
                size="sm"
              />
              <span class="text-muted shrink-0">{{ link.quantityUsed }} {{ link.unit || link.supplyUnit }}</span>
              <UBadge
                v-if="link.consumed"
                label="used"
                color="success"
                variant="subtle"
                size="sm"
              />
            </span>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="error"
              size="xs"
              @click="removeLink(link.supplyId)"
            />
          </li>
        </ul>
      </UCard>
    </template>

    <UModal
      v-model:open="linkModalOpen"
      title="Link a Supply"
      description="Attach a supply from your stash to this project."
      :ui="{ content: 'sm:max-w-xl' }"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField label="Supply">
            <USelectMenu
              v-model="linkState.supply"
              :items="supplyItems"
              searchable
              placeholder="Select a supply"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Quantity used">
              <UInputNumber
                v-model="linkState.quantityUsed"
                :step="0.0625"
                :min="0"
              />
            </UFormField>
            <UFormField label="Unit">
              <UInput
                v-model="linkState.unit"
                placeholder="yard"
              />
            </UFormField>
          </div>
          <UFormField label="Notes">
            <UEditor
              v-model="linkState.notes"
              content-type="markdown"
              placeholder="Add any notes about this supply link..."
              :ui="{ content: 'min-h-32' }"
            >
              <template #default="{ editor }">
                <UEditorToolbar
                  :editor="editor"
                  :items="notesEditorItems"
                />
              </template>
            </UEditor>
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              variant="ghost"
              color="neutral"
              @click="linkModalOpen = false"
            />
            <UButton
              label="Link supply"
              :loading="linkSaving"
              :disabled="!selectedSupplyId"
              @click="addLink"
            />
          </div>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
