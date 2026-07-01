<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-default text-default p-4">
    <NuxtLink
      to="/"
      class="flex items-center gap-2 font-semibold mb-8"
    >
      <UIcon
        name="i-lucide-grid-2x2"
        class="text-primary size-6"
      />
      <span class="text-xl">Quiltly</span>
    </NuxtLink>
    <slot />
  </main>
</template>
