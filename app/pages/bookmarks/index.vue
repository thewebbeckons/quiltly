<script setup lang="ts">
import { z } from 'zod'
import type { Bookmark } from '~~/shared/types/db'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { data: bookmarks, refresh } = await useFetch<Bookmark[]>('/api/bookmarks', { default: () => [] })

const adding = ref(false)
const url = ref('')
const urlInput = ref()
const urlSchema = z.object({ url: z.string().url('Enter a valid URL') })

async function addBookmark() {
  const parsed = urlSchema.safeParse({ url: url.value })
  if (!parsed.success) {
    toast.add({ title: parsed.error.issues[0]?.message ?? 'Invalid URL', color: 'error' })
    return
  }
  adding.value = true
  try {
    await $fetch('/api/bookmarks', { method: 'POST', body: { url: url.value } })
    toast.add({ title: 'Bookmark saved', color: 'success' })
    url.value = ''
    await refresh()
  } catch (e) {
    toast.add({ title: 'Save failed', description: (e as Error).message, color: 'error' })
  } finally {
    adding.value = false
  }
}

onMounted(() => {
  if (route.query.new === '1') {
    nextTick(() => urlInput.value?.inputRef?.focus())
    router.replace({ query: {} })
  }
})

async function toggleFavorite(bookmark: Bookmark) {
  try {
    await $fetch(`/api/bookmarks/${bookmark.id}`, { method: 'PATCH', body: { favorite: !bookmark.favorite } })
    await refresh()
  } catch (e) {
    toast.add({ title: 'Update failed', description: (e as Error).message, color: 'error' })
  }
}

async function remove(bookmark: Bookmark) {
  try {
    await $fetch(`/api/bookmarks/${bookmark.id}`, { method: 'DELETE' })
    toast.add({ title: 'Bookmark removed', color: 'success' })
    await refresh()
  } catch (e) {
    toast.add({ title: 'Delete failed', description: (e as Error).message, color: 'error' })
  }
}
</script>

<template>
  <UContainer class="py-6 space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">
        Inspiration
      </h1>
      <p class="text-muted text-sm">
        {{ bookmarks?.length }} bookmark{{ bookmarks?.length === 1 ? '' : 's' }}
      </p>
    </div>

    <div class="flex gap-2">
      <UInput
        ref="urlInput"
        v-model="url"
        placeholder="https://example.com/quilt-idea"
        icon="i-lucide-link"
        class="flex-1"
        @keydown.enter="addBookmark"
      />
      <UButton
        icon="i-lucide-plus"
        label="Save"
        :loading="adding"
        @click="addBookmark"
      />
    </div>

    <div
      v-if="!bookmarks?.length"
      class="text-center py-16 text-muted"
    >
      <UIcon
        name="i-lucide-bookmark"
        class="size-10 mx-auto mb-3 opacity-50"
      />
      <p>No bookmarks yet.</p>
    </div>

    <ul
      v-else
      class="grid sm:grid-cols-2 gap-3"
    >
      <li
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
      >
        <UCard :ui="{ body: 'p-3 sm:p-4' }">
          <div class="flex items-start gap-3">
            <img
              v-if="bookmark.ogImage"
              :src="bookmark.ogImage"
              :alt="bookmark.title || ''"
              class="size-12 rounded object-cover shrink-0 bg-elevated"
            >
            <div
              v-else
              class="size-12 rounded bg-elevated flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-lucide-image"
                class="text-muted"
              />
            </div>
            <div class="min-w-0 flex-1">
              <UButton
                :to="bookmark.url"
                target="_blank"
                variant="link"
                color="neutral"
                class="p-0 -ml-1 align-baseline font-medium text-left truncate block"
                :label="bookmark.title || bookmark.url"
                trailing-icon="i-lucide-external-link"
              />
              <p
                v-if="bookmark.description"
                class="text-sm text-muted line-clamp-2"
              >
                {{ bookmark.description }}
              </p>
              <div
                v-if="bookmark.tags?.length"
                class="flex flex-wrap gap-1 mt-1"
              >
                <UBadge
                  v-for="tag in bookmark.tags"
                  :key="tag"
                  :label="tag"
                  variant="subtle"
                  size="sm"
                />
              </div>
            </div>
            <div class="flex flex-col gap-1 shrink-0">
              <UButton
                :icon="bookmark.favorite ? 'i-lucide-heart' : 'i-lucide-heart'"
                :color="bookmark.favorite ? 'error' : 'neutral'"
                variant="ghost"
                size="xs"
                @click="toggleFavorite(bookmark)"
              />
              <UButton
                icon="i-lucide-trash-2"
                variant="ghost"
                color="error"
                size="xs"
                @click="remove(bookmark)"
              />
            </div>
          </div>
        </UCard>
      </li>
    </ul>
  </UContainer>
</template>
