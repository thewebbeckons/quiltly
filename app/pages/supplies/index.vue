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

function supplyTone(type: SupplyType) {
  return ({
    fabric: 'bg-calico-100 text-calico-700',
    thread: 'bg-petal-100 text-petal-700',
    batting: 'bg-sky-100 text-sky-700',
    notion: 'bg-marigold-100 text-marigold-700',
    tool: 'bg-meadow-100 text-meadow-700',
    pattern: 'bg-sky-100 text-sky-700',
    other: 'bg-muslin-200 text-muslin-700'
  } as Partial<Record<SupplyType, string>>)[type] || 'bg-muslin-200 text-muslin-700'
}
</script>

<template>
  <UContainer class="space-y-8 pb-10">
    <AppPageHeader
      eyebrow="Your fabric shelf"
      title="Know what you have before you start."
      description="Keep fabric, batting, thread, tools, and notions counted, noted, and ready for the next cut."
      icon="i-lucide-package-open"
      tone="meadow"
      :meta="`${supplies?.length ?? 0} ${supplies?.length === 1 ? 'item' : 'items'} in your stash`"
    >
      <template #actions>
        <UButton
          icon="i-lucide-plus"
          label="Add a supply"
          @click="openCreate"
        />
      </template>
    </AppPageHeader>

    <div class="app-toolbar">
      <div>
        <p class="editorial-label text-toned">
          Stash inventory
        </p>
        <p class="mt-2 text-sm text-muted">
          Filter the shelf by material or tool type.
        </p>
      </div>
      <USelect
        v-model="typeFilter"
        :items="typeOptions"
        aria-label="Filter supplies by type"
        class="w-full sm:w-52"
      />
    </div>

    <AppEmptyState
      v-if="!supplies?.length"
      icon="i-lucide-package-open"
      eyebrow="An empty shelf"
      title="Start with the materials close at hand."
      description="Add your first fabric, thread, or tool. Quiltly will help you keep quantities and low-stock notes in view."
    >
      <UButton
        label="Add your first supply"
        icon="i-lucide-plus"
        @click="openCreate"
      />
    </AppEmptyState>

    <section v-else>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="app-section-heading">
          <UIcon
            name="i-lucide-layers-3"
            class="size-3.5 text-primary"
          />
          On your shelf
        </h2>
        <span class="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-dimmed">{{ supplies.length }} shown</span>
      </div>
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <li
          v-for="supply in supplies"
          :key="supply.id"
        >
          <UCard
            :ui="{ body: 'p-5 sm:p-5' }"
            class="app-card h-full"
          >
            <div class="flex h-full flex-col gap-4">
              <div class="flex items-start justify-between gap-3">
                <div
                  class="flex size-11 shrink-0 items-center justify-center rounded-full"
                  :class="supplyTone(supply.type)"
                >
                  <UIcon
                    name="i-lucide-package"
                    class="size-5"
                  />
                </div>
                <div class="flex flex-wrap justify-end gap-1">
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
              <div>
                <p class="font-display text-2xl font-medium leading-7 tracking-[-0.035em] text-highlighted">
                  {{ supply.name }}
                </p>
                <UBadge
                  :label="formatEnum(supply.type)"
                  variant="subtle"
                  size="sm"
                  class="mt-2"
                />
              </div>
              <div class="border-y border-dashed border-default py-3">
                <p class="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted">
                  On hand
                </p>
                <p class="mt-1 text-lg text-highlighted">
                  {{ supply.quantity }} {{ supply.unit || 'units' }}<span
                    v-if="supply.color"
                    class="text-muted"
                  > · {{ supply.color }}</span>
                </p>
              </div>
              <!-- Markdown is escaped and protocol-filtered by renderMarkdown. -->
              <!-- eslint-disable vue/no-v-html -->
              <div
                v-if="supply.notes"
                class="mt-auto line-clamp-3 text-sm text-muted [&_p]:my-0 [&_p]:leading-6 [&_ul]:list-disc [&_ul]:ps-4 [&_ol]:list-decimal [&_ol]:ps-4 [&_strong]:font-semibold"
                v-html="renderMarkdown(supply.notes)"
              />
              <!-- eslint-enable vue/no-v-html -->
              <div
                v-else
                class="mt-auto text-sm italic text-muted/60"
              >
                No notes yet
              </div>
            </div>
            <div class="mt-4 flex items-center justify-end gap-1 border-t border-default/70 pt-3">
              <UButton
                icon="i-lucide-pencil"
                aria-label="Edit supply"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="openEdit(supply)"
              />
              <UButton
                icon="i-lucide-trash-2"
                aria-label="Delete supply"
                variant="ghost"
                color="error"
                size="xs"
                @click="remove(supply)"
              />
            </div>
          </UCard>
        </li>
      </ul>
    </section>

    <UModal
      v-model:open="modalOpen"
      :title="editing ? 'Edit supply' : 'Add supply'"
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
