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

function hostname(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return value
  }
}

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
  <UContainer class="space-y-8 pb-10">
    <AppPageHeader
      eyebrow="Your inspiration board"
      title="Keep the ideas worth returning to."
      description="Collect patterns, tutorials, color stories, and thoughtful details before the spark slips away."
      icon="i-lucide-bookmark"
      tone="petal"
      :meta="`${bookmarks?.length ?? 0} saved ${bookmarks?.length === 1 ? 'idea' : 'ideas'}`"
    />

    <section class="grid gap-4 bg-elevated/65 p-5 shadow-[0_18px_50px_rgb(68_60_56_/_0.045)] sm:grid-cols-[0.45fr_1fr] sm:items-end sm:p-6">
      <div>
        <p class="editorial-label text-primary">
          Pin something new
        </p>
        <h2 class="mt-3 text-3xl text-highlighted">
          Save the spark.
        </h2>
        <p class="mt-2 text-sm leading-6 text-muted">
          Paste a link and Quiltly will gather the useful details.
        </p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <UInput
          ref="urlInput"
          v-model="url"
          placeholder="https://example.com/quilt-idea"
          icon="i-lucide-link"
          aria-label="Bookmark URL"
          class="flex-1"
          size="lg"
          @keydown.enter="addBookmark"
        />
        <UButton
          icon="i-lucide-plus"
          label="Save idea"
          size="lg"
          :loading="adding"
          @click="addBookmark"
        />
      </div>
    </section>

    <AppEmptyState
      v-if="!bookmarks?.length"
      icon="i-lucide-bookmark"
      eyebrow="An open pinboard"
      title="Your next idea belongs here."
      description="Save a pattern, tutorial, or color palette and it will be waiting when you are ready to make."
    >
      <UButton
        label="Focus the link field"
        variant="soft"
        icon="i-lucide-arrow-up"
        @click="urlInput?.inputRef?.focus()"
      />
    </AppEmptyState>

    <section v-else>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="app-section-heading">
          <UIcon
            name="i-lucide-sparkles"
            class="size-3.5 text-primary"
          />
          Saved inspiration
        </h2>
        <span class="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-dimmed">Newest first</span>
      </div>
      <ul class="grid gap-4 sm:grid-cols-2">
        <li
          v-for="bookmark in bookmarks"
          :key="bookmark.id"
        >
          <UCard
            :ui="{ body: 'p-0 sm:p-0' }"
            class="app-card h-full"
          >
            <div class="grid h-full grid-cols-[6rem_1fr] sm:grid-cols-[8rem_1fr]">
              <img
                v-if="bookmark.ogImage"
                :src="bookmark.ogImage"
                :alt="bookmark.title || ''"
                class="h-full min-h-40 w-full object-cover bg-muted"
              >
              <div
                v-else
                class="bookmark-placeholder flex min-h-40 items-center justify-center bg-petal-100 text-petal-700"
              >
                <UIcon
                  name="i-lucide-image"
                  class="size-7"
                />
              </div>
              <div class="flex min-w-0 flex-col p-4 sm:p-5">
                <div class="flex items-start justify-between gap-2">
                  <p class="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted">
                    {{ hostname(bookmark.url) }}
                  </p>
                  <UButton
                    icon="i-lucide-heart"
                    :aria-label="bookmark.favorite ? 'Remove from favorites' : 'Add to favorites'"
                    :color="bookmark.favorite ? 'error' : 'neutral'"
                    variant="ghost"
                    size="xs"
                    class="-mr-2 -mt-2"
                    @click="toggleFavorite(bookmark)"
                  />
                </div>
                <UButton
                  :to="bookmark.url"
                  target="_blank"
                  variant="link"
                  color="neutral"
                  class="mt-2 block justify-start p-0 text-left font-display text-xl font-medium leading-6 text-highlighted sm:text-2xl"
                  :label="bookmark.title || bookmark.url"
                  trailing-icon="i-lucide-external-link"
                />
                <p
                  v-if="bookmark.description"
                  class="mt-2 line-clamp-2 text-sm leading-5 text-muted"
                >
                  {{ bookmark.description }}
                </p>
                <div
                  v-if="bookmark.tags?.length"
                  class="mt-auto flex flex-wrap gap-1 pt-4"
                >
                  <UBadge
                    v-for="tag in bookmark.tags"
                    :key="tag"
                    :label="tag"
                    variant="subtle"
                    size="sm"
                  />
                </div>
                <div class="mt-auto flex justify-end pt-3">
                  <UButton
                    icon="i-lucide-trash-2"
                    aria-label="Delete bookmark"
                    variant="ghost"
                    color="error"
                    size="xs"
                    @click="remove(bookmark)"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </li>
      </ul>
    </section>
  </UContainer>
</template>
