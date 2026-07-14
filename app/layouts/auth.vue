<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-default text-default p-5 paper-noise hero-wash">
    <NuxtLink
      to="/"
      class="flex items-center gap-3 mb-10"
    >
      <LandingPatch size="sm" />
      <span class="font-display text-2xl font-medium tracking-[-0.04em]">Quiltly</span>
    </NuxtLink>
    <slot />
  </main>
</template>
