<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), { size: 'md' })

const squares = [
  'bg-petal-400 rotate-[-3deg]', 'bg-marigold-300 rotate-[2deg]', 'bg-sky-300 rotate-[-1deg]',
  'bg-meadow-300 rotate-[2deg]', 'bg-calico-300 rotate-[-2deg]', 'bg-petal-300 rotate-[3deg]',
  'bg-sky-400 rotate-[-2deg]', 'bg-meadow-400 rotate-[1deg]', 'bg-marigold-400 rotate-[-3deg]'
]

const cell = computed(() => ({
  sm: 'size-2',
  md: 'size-3.5',
  lg: 'size-9'
}[props.size]))

const gap = computed(() => ({
  sm: 'gap-px',
  md: 'gap-0.5',
  lg: 'gap-1'
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
      class="patch-cell rounded-[1px] ring-1 ring-inset ring-white/25"
    />
  </div>
</template>

<style scoped>
.patch-cell {
  opacity: 0.82;
  filter: saturate(0.84);
  mix-blend-mode: multiply;
  box-shadow: inset 0 0 0.7rem rgb(255 255 255 / 0.2);
}
</style>
