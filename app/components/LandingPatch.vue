<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), { size: 'md' })

const squares = [
  'bg-calico-500', 'bg-muslin-200', 'bg-meadow-500',
  'bg-muslin-200', 'bg-marigold-400', 'bg-muslin-200',
  'bg-meadow-500', 'bg-muslin-200', 'bg-calico-500'
]

const cell = computed(() => ({
  sm: 'size-2',
  md: 'size-3.5',
  lg: 'size-9'
}[props.size]))

const gap = computed(() => ({
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5'
}[props.size]))
</script>

<template>
  <div
    class="grid grid-cols-3"
    :class="gap"
    aria-hidden="true"
  >
    <div
      v-for="(color, i) in squares"
      :key="i"
      :class="[color, cell]"
      class="rounded-[3px] ring-1 ring-inset ring-black/5"
    />
  </div>
</template>
