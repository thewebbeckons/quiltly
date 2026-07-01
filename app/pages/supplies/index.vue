<script setup lang="ts">
import { z } from 'zod'
import type { Supply } from '~~/shared/types/db'
import type { SupplyType } from '~~/shared/types/enums'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { SUPPLY_TYPES } = await import('~~/shared/types/enums')

const ALL_TYPES = 'all' as const
const typeFilter = ref<SupplyType | typeof ALL_TYPES>(ALL_TYPES)
const typeQuery = computed(() => typeFilter.value === ALL_TYPES ? undefined : typeFilter.value)
const { data: supplies, refresh } = await useFetch<Supply[]>('/api/supplies', {
  query: { type: typeQuery },
  default: () => []
})

const typeOptions = [
  { label: 'All types', value: ALL_TYPES },
  ...SUPPLY_TYPES.map(t => ({ label: formatEnum(t), value: t }))
]

const typeItems = SUPPLY_TYPES.map(t => ({ label: formatEnum(t), value: t }))

const modalOpen = ref(false)
const editing = ref<Supply | null>(null)
const saving = ref(false)

const empty = () => ({
  name: '',
  type: 'fabric' as SupplyType,
  quantity: 0,
  unit: '',
  color: '',
  lowStockThreshold: 1,
  notes: ''
})
const state = reactive(empty())

const schema = z.object({
  name: z.string().min(1, 'Required'),
  type: z.string().min(1),
  quantity: z.number(),
  unit: z.string().optional(),
  color: z.string().optional(),
  lowStockThreshold: z.number(),
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

function openEdit(supply: Supply) {
  editing.value = supply
  Object.assign(state, {
    name: supply.name,
    type: supply.type,
    quantity: supply.quantity,
    unit: supply.unit ?? '',
    color: supply.color ?? '',
    lowStockThreshold: supply.lowStockThreshold,
    notes: supply.notes ?? ''
  })
  modalOpen.value = true
}

async function onSubmit() {
  saving.value = true
  const payload = {
    ...state,
    unit: state.unit || undefined,
    color: state.color || undefined,
    notes: state.notes || undefined
  }
  try {
    if (editing.value) {
      await $fetch(`/api/supplies/${editing.value.id}`, { method: 'PATCH', body: payload })
      toast.add({ title: 'Supply updated', color: 'success' })
    } else {
      await $fetch('/api/supplies', { method: 'POST', body: payload })
      toast.add({ title: 'Supply added', color: 'success' })
    }
    modalOpen.value = false
    await refresh()
  } catch (e) {
    toast.add({ title: 'Save failed', description: (e as Error).message, color: 'error' })
  } finally {
    saving.value = false
  }
}

async function remove(supply: Supply) {
  try {
    await $fetch(`/api/supplies/${supply.id}`, { method: 'DELETE' })
    toast.add({ title: 'Supply removed', color: 'success' })
    await refresh()
  } catch (e) {
    toast.add({ title: 'Delete failed', description: (e as Error).message, color: 'error' })
  }
}

function isLow(s: Supply) {
  return s.quantity <= s.lowStockThreshold
}
</script>

<template>
  <UContainer class="py-6 space-y-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold">
          Supplies
        </h1>
        <p class="text-muted text-sm">
          {{ supplies?.length }} item{{ supplies?.length === 1 ? '' : 's' }}
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Add"
        @click="openCreate"
      />
    </div>

    <USelect
      v-model="typeFilter"
      :items="typeOptions"
      class="w-full max-w-48"
    />

    <div
      v-if="!supplies?.length"
      class="text-center py-16 text-muted"
    >
      <UIcon
        name="i-lucide-package"
        class="size-10 mx-auto mb-3 opacity-50"
      />
      <p>No supplies yet.</p>
      <UButton
        label="Add your first supply"
        variant="link"
        @click="openCreate"
      />
    </div>

    <ul
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
    >
      <li
        v-for="supply in supplies"
        :key="supply.id"
      >
        <UCard
          :ui="{ body: 'p-4 sm:p-4' }"
          class="h-full transition-shadow hover:shadow-lg"
        >
          <div class="flex flex-col gap-3 h-full">
            <div class="flex items-start justify-between gap-2">
              <span class="font-medium leading-snug line-clamp-2">{{ supply.name }}</span>
              <div class="flex flex-wrap gap-1 shrink-0">
                <UBadge
                  :label="formatEnum(supply.type)"
                  variant="subtle"
                  size="sm"
                />
                <UBadge
                  v-if="isLow(supply)"
                  label="Low stock"
                  color="warning"
                  variant="subtle"
                  size="sm"
                  icon="i-lucide-triangle-alert"
                />
              </div>
            </div>
            <p class="text-sm text-muted">
              {{ supply.quantity }} {{ supply.unit }}<span v-if="supply.color"> · {{ supply.color }}</span>
            </p>
            <div
              v-if="supply.notes"
              class="text-sm text-muted line-clamp-3 mt-auto [&_p]:my-0 [&_p]:leading-6 [&_ul]:list-disc [&_ul]:ps-4 [&_ol]:list-decimal [&_ol]:ps-4 [&_strong]:font-semibold"
              v-html="renderMarkdown(supply.notes)"
            />
            <div
              v-else
              class="text-sm text-muted/60 italic mt-auto"
            >
              No notes
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0 pt-3 border-t border-muted/50 mt-3">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openEdit(supply)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="xs"
              @click="remove(supply)"
            />
          </div>
        </UCard>
      </li>
    </ul>

    <UModal
      v-model:open="modalOpen"
      :title="editing ? 'Edit Supply' : 'Add Supply'"
      :description="editing ? 'Update the details of this supply.' : 'Add a new item to your stash.'"
      :ui="{ content: 'sm:max-w-xl' }"
    >
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            name="name"
            label="Name"
            required
          >
            <UInput
              v-model="state.name"
              placeholder="Kona cotton"
            />
          </UFormField>
          <UFormField
            name="type"
            label="Type"
            required
          >
            <USelect
              v-model="state.type"
              :items="typeItems"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField
              name="quantity"
              label="Quantity"
            >
              <UInputNumber
                v-model="state.quantity"
                :step="0.0625"
              />
            </UFormField>
            <UFormField
              name="unit"
              label="Unit"
            >
              <UInput
                v-model="state.unit"
                placeholder="yard"
              />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <UFormField
              name="color"
              label="Color"
            >
              <UInput
                v-model="state.color"
                placeholder="Navy"
              />
            </UFormField>
            <UFormField
              name="lowStockThreshold"
              label="Low-stock at"
            >
              <UInputNumber
                v-model="state.lowStockThreshold"
                :step="0.0625"
                :min="0"
              />
            </UFormField>
          </div>
          <UFormField
            name="notes"
            label="Notes"
          >
            <UEditor
              v-model="state.notes"
              content-type="markdown"
              placeholder="Add any notes about this supply..."
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
              @click="modalOpen = false"
            />
            <UButton
              type="submit"
              :loading="saving"
              :label="editing ? 'Save changes' : 'Add supply'"
            />
          </div>
        </UForm>
      </template>
    </UModal>
  </UContainer>
</template>
