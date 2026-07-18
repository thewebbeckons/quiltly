<script setup lang="ts">
defineProps<{
  icon: string
  eyebrow?: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="empty-sampler flex flex-col items-center px-5 py-14 text-center sm:py-16">
    <div class="mb-5 flex size-16 items-center justify-center rounded-full bg-calico-100 text-calico-700">
      <UIcon
        :name="icon"
        class="size-6"
      />
    </div>
    <p
      v-if="eyebrow"
      class="editorial-label text-primary"
    >
      {{ eyebrow }}
    </p>
    <h2 class="mt-3 text-3xl text-highlighted">
      {{ title }}
    </h2>
    <p class="mt-3 max-w-md text-base leading-6 text-muted">
      {{ description }}
    </p>
    <div class="mt-6">
      <slot />
    </div>
  </div>
</template>
