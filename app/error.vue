<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => error.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)

const eyebrow = computed(() => isNotFound.value ? 'A loose thread' : 'A small snag')
const title = computed(() => isNotFound.value
  ? 'This page wandered off-pattern.'
  : 'A stitch slipped behind the scenes.')
const description = computed(() => isNotFound.value
  ? 'Even the neatest quilt has the occasional loose thread. We checked under the sewing table, but this page is nowhere to be found.'
  : 'Your work should still be tucked safely away. Let’s return to familiar fabric and pick up the pattern from there.')

useHead({
  title: () => `${statusCode.value} · Quiltly`,
  meta: [{ name: 'robots', content: 'noindex' }],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Red+Hat+Mono:wght@400;500;600&display=swap' }
  ],
  htmlAttrs: { lang: 'en' }
})

async function returnHome() {
  await clearError({ redirect: '/' })
}

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
    return
  }

  void returnHome()
}
</script>

<template>
  <UApp>
    <div class="error-page paper-noise">
      <header class="error-header">
        <a
          href="/"
          class="error-brand"
          aria-label="Return to Quiltly home"
          @click.prevent="returnHome"
        >
          <LandingPatch size="sm" />
          <span class="font-display">Quiltly</span>
        </a>

        <span class="editorial-label text-muted">The quilting workroom</span>
      </header>

      <main class="error-main">
        <section class="error-copy reveal-up">
          <p class="editorial-label text-primary">
            {{ eyebrow }} · {{ statusCode }}
          </p>

          <h1>{{ title }}</h1>

          <p class="error-description">
            {{ description }}
          </p>

          <div class="error-actions">
            <UButton
              size="lg"
              label="Back to Quiltly"
              trailing-icon="i-lucide-arrow-right"
              @click="returnHome"
            />
            <UButton
              size="lg"
              color="neutral"
              variant="ghost"
              label="Go back"
              icon="i-lucide-undo-2"
              @click="goBack"
            />
          </div>
        </section>

        <div
          class="error-sampler reveal-up"
          style="animation-delay: 120ms"
          aria-hidden="true"
        >
          <span class="sampler-stitch sampler-stitch-top" />
          <span class="sampler-stitch sampler-stitch-right" />

          <div class="sampler-grid">
            <span class="sampler-patch bg-petal-300 -rotate-2" />
            <span class="sampler-patch bg-marigold-300 rotate-1" />
            <span class="sampler-patch bg-sky-300 -rotate-1" />
            <span class="sampler-patch bg-meadow-300 rotate-2" />
            <span class="sampler-code">{{ statusCode }}</span>
            <span class="sampler-patch bg-petal-200 rotate-3" />
            <span class="sampler-patch bg-sky-300 -rotate-2" />
            <span class="sampler-patch bg-meadow-300 rotate-1" />
            <span class="sampler-missing">
              <UIcon name="i-lucide-sparkles" />
            </span>
          </div>

          <p class="editorial-label">
            One patch temporarily misplaced
          </p>
        </div>
      </main>

      <footer class="error-footer">
        <span class="editorial-label text-muted">Made for thoughtful making</span>
        <span
          class="error-thread"
          aria-hidden="true"
        />
      </footer>
    </div>
  </UApp>
</template>

<style scoped>
.error-page {
  position: relative;
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 16%, rgb(237 172 186 / 0.2), transparent 25rem),
    radial-gradient(circle at 86% 76%, rgb(164 201 198 / 0.2), transparent 28rem),
    linear-gradient(145deg, rgb(255 249 237 / 0.72), rgb(251 240 220 / 0.94));
  color: var(--ui-text);
}

.error-header,
.error-footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-inline: clamp(1.25rem, 4vw, 4rem);
  padding-block: 1.5rem;
}

.error-header {
  border-bottom: 1px solid color-mix(in srgb, var(--ui-text-highlighted) 14%, transparent);
}

.error-brand {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 0.75rem;
  font-family: inherit;
}

.error-brand .font-display {
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.04em;
}

.error-main {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(100% - 2.5rem, 72rem);
  flex: 1;
  grid-template-columns: minmax(0, 1fr) minmax(21rem, 0.85fr);
  align-items: center;
  gap: clamp(3rem, 9vw, 8rem);
  margin: auto;
  padding-block: clamp(4rem, 9vh, 7rem);
}

.error-copy {
  max-width: 40rem;
}

.error-copy h1 {
  max-width: 11ch;
  margin-top: 1.35rem;
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 8vw, 6.75rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.89;
  text-wrap: balance;
}

.error-description {
  max-width: 38rem;
  margin-top: 2rem;
  color: var(--ui-text-muted);
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  line-height: 1.55;
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2.25rem;
}

.error-sampler {
  position: relative;
  width: min(100%, 27rem);
  justify-self: end;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: rgb(255 249 237 / 0.66);
  box-shadow: 0 30px 80px rgb(68 60 56 / 0.08);
  transform: rotate(1.5deg);
}

.error-sampler::before {
  position: absolute;
  inset: 0.65rem;
  border: 1px dashed rgb(155 126 103 / 0.45);
  content: "";
  pointer-events: none;
}

.sampler-grid {
  display: grid;
  aspect-ratio: 1;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.35rem, 1vw, 0.65rem);
}

.sampler-patch,
.sampler-code,
.sampler-missing {
  display: grid;
  aspect-ratio: 1;
  place-items: center;
  border-radius: 1px;
}

.sampler-patch {
  box-shadow: inset 0 0 2rem rgb(255 255 255 / 0.22);
  opacity: 0.82;
  filter: saturate(0.78);
}

.sampler-code {
  background: var(--ui-text-highlighted);
  color: var(--color-muslin-50);
  font-family: var(--font-mono);
  font-size: clamp(1.25rem, 4vw, 2.25rem);
  font-weight: 500;
  letter-spacing: -0.08em;
  transform: rotate(-1deg);
}

.sampler-missing {
  border: 1px dashed rgb(155 126 103 / 0.72);
  color: var(--color-calico-500);
  transform: rotate(-3deg);
}

.sampler-missing svg {
  width: 1.25rem;
  height: 1.25rem;
  opacity: 0.72;
}

.error-sampler p {
  margin-top: 1.75rem;
  color: var(--ui-text-muted);
  text-align: center;
}

.sampler-stitch {
  position: absolute;
  display: block;
  border-color: rgb(185 83 60 / 0.42);
  border-style: dashed;
  pointer-events: none;
}

.sampler-stitch-top {
  top: -1rem;
  left: 2rem;
  width: 5rem;
  height: 2rem;
  border-width: 1px 0 0;
  border-radius: 50%;
  transform: rotate(-8deg);
}

.sampler-stitch-right {
  right: -1.35rem;
  bottom: 3rem;
  width: 2.5rem;
  height: 6rem;
  border-width: 0 1px 0 0;
  border-radius: 50%;
  transform: rotate(7deg);
}

.error-footer {
  align-items: end;
  padding-bottom: 1.5rem;
}

.error-thread {
  display: block;
  width: min(35vw, 20rem);
  height: 1.5rem;
  border-top: 1px dashed rgb(185 83 60 / 0.38);
  border-radius: 50%;
  transform: rotate(-2deg);
}

@media (max-width: 800px) {
  .error-header > .editorial-label {
    display: none;
  }

  .error-main {
    grid-template-columns: 1fr;
    gap: 3.5rem;
    padding-block: 3.5rem;
  }

  .error-copy h1 {
    font-size: clamp(3.25rem, 15vw, 5rem);
  }

  .error-sampler {
    width: min(88%, 22rem);
    justify-self: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .error-page .reveal-up {
    animation: none;
  }
}
</style>
