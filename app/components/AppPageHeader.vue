<script setup lang="ts">
const { eyebrow, title, description, icon, tone = 'calico', meta } = defineProps<{
  eyebrow: string
  title: string
  description: string
  icon: string
  tone?: 'calico' | 'meadow' | 'sky' | 'petal' | 'marigold'
  meta?: string
}>()

const toneClasses = computed(() => ({
  calico: 'bg-calico-100 text-calico-700',
  meadow: 'bg-meadow-100 text-meadow-700',
  sky: 'bg-sky-100 text-sky-700',
  petal: 'bg-petal-100 text-petal-700',
  marigold: 'bg-marigold-100 text-marigold-700'
})[tone])

const patchClasses = computed(() => ({
  calico: ['bg-calico-300', 'bg-petal-200', 'bg-marigold-200', 'bg-calico-200'],
  meadow: ['bg-meadow-300', 'bg-sky-200', 'bg-calico-200', 'bg-meadow-200'],
  sky: ['bg-sky-300', 'bg-meadow-200', 'bg-petal-200', 'bg-sky-200'],
  petal: ['bg-petal-300', 'bg-calico-200', 'bg-sky-200', 'bg-petal-200'],
  marigold: ['bg-marigold-300', 'bg-calico-200', 'bg-meadow-200', 'bg-marigold-200']
})[tone])
</script>

<template>
  <header class="app-page-header reveal-up">
    <div class="relative z-10 min-w-0">
      <div class="mb-5 flex items-center gap-3">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-full"
          :class="toneClasses"
        >
          <UIcon
            :name="icon"
            class="size-[1.15rem]"
          />
        </div>
        <p class="editorial-label text-toned">
          {{ eyebrow }}
        </p>
      </div>

      <h1 class="max-w-3xl text-highlighted">
        {{ title }}
      </h1>
      <p class="mt-4 max-w-2xl text-lg leading-7 text-toned">
        {{ description }}
      </p>

      <div class="mt-7 flex flex-wrap items-center gap-3">
        <p
          v-if="meta"
          class="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-muted"
        >
          {{ meta }}
        </p>
        <slot name="actions" />
      </div>
    </div>

    <div class="relative z-10 hidden items-center justify-end sm:flex">
      <div class="relative grid grid-cols-2 rotate-2 shadow-[0_24px_55px_rgb(68_60_56_/_0.14)]">
        <div
          v-for="(patch, index) in patchClasses"
          :key="patch"
          class="header-patch size-16 lg:size-20"
          :class="[patch, index % 2 === 0 ? 'header-patch-lines' : 'header-patch-diamond']"
        />
        <div
          class="absolute inset-0 grid place-items-center"
          aria-hidden="true"
        >
          <div class="grid size-11 place-items-center rounded-full bg-elevated/90 text-highlighted shadow-sm lg:size-12">
            <UIcon
              :name="icon"
              class="size-5"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-patch {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.62);
}

.header-patch-lines::after {
  position: absolute;
  inset: -40%;
  content: '';
  border: 12px solid rgb(255 249 237 / 0.42);
  transform: rotate(45deg);
}

.header-patch-diamond::after {
  position: absolute;
  inset: 30%;
  content: '';
  background: rgb(255 249 237 / 0.55);
  transform: rotate(45deg);
}
</style>
