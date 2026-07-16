<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })

const { user } = useUserSession()
const toast = useToast()
const step = ref(0)
const saving = ref(false)

const steps = [
  {
    eyebrow: 'Welcome to your workspace',
    title: 'A calmer place for every quilt in progress.',
    description: 'Quiltly keeps your materials, plans, and sparks of inspiration together—so you can spend less time searching and more time making.',
    icon: 'i-lucide-sparkles',
    color: 'calico'
  },
  {
    eyebrow: 'Your fabric shelf',
    title: 'Know what you have before you start.',
    description: 'Add fabric, batting, thread, tools, and notions to Supplies. Quantities and low-stock reminders make the next fabric-store trip much easier.',
    icon: 'i-lucide-package-open',
    color: 'meadow'
  },
  {
    eyebrow: 'Your cutting table',
    title: 'Move quilts from idea to finished.',
    description: 'Create a Project, attach the supplies it needs, and keep its pattern, due date, notes, and progress in one tidy place.',
    icon: 'i-lucide-folder-kanban',
    color: 'sky'
  },
  {
    eyebrow: 'Your inspiration board',
    title: 'Save the ideas worth returning to.',
    description: 'Bookmark patterns, tutorials, and color stories as you find them. Your Dashboard then brings the whole workspace into view.',
    icon: 'i-lucide-bookmark-heart',
    color: 'petal'
  }
] as const

const current = computed(() => steps[step.value]!)
const isLastStep = computed(() => step.value === steps.length - 1)
const firstName = computed(() => user.value?.name?.trim().split(/\s+/)[0] || 'there')
const displayTitle = computed(() => step.value === 0
  ? `Hi ${firstName.value}. ${current.value.title}`
  : current.value.title)

const toneClasses = computed(() => ({
  calico: 'bg-calico-100 text-calico-700',
  meadow: 'bg-meadow-100 text-meadow-700',
  sky: 'bg-sky-100 text-sky-700',
  petal: 'bg-petal-100 text-petal-700'
})[current.value.color])

onMounted(async () => {
  try {
    const preferences = await $fetch('/api/onboarding')
    if (!preferences.completed) open.value = true
  } catch {
    // The tour should never prevent access to the app if preferences cannot load.
  }
})

watch(open, (isOpen) => {
  if (isOpen) step.value = 0
})

function next() {
  if (!isLastStep.value) step.value += 1
}

function previous() {
  if (step.value > 0) step.value -= 1
}

async function completeTour() {
  saving.value = true
  try {
    await $fetch('/api/onboarding', { method: 'PATCH' })
    open.value = false
  } catch {
    toast.add({
      title: 'Could not save your progress',
      description: 'Please try again. Your workspace is still safe to use.',
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Getting started with Quiltly"
    description="A four-step tour of your quilting workspace"
    :dismissible="false"
    :close="false"
    :ui="{ content: 'sm:max-w-3xl overflow-hidden' }"
  >
    <template #content>
      <div class="grid min-h-[34rem] md:grid-cols-[0.82fr_1.18fr]">
        <div class="onboarding-swatch relative hidden overflow-hidden border-r border-default md:flex md:flex-col md:justify-between p-8">
          <div class="relative z-10">
            <div class="editorial-label text-toned">
              The getting-started sampler
            </div>
            <p class="mt-3 max-w-48 text-sm text-muted">
              Four small patches. One organized quilting practice.
            </p>
          </div>

          <div class="relative z-10 grid w-48 grid-cols-2 self-center shadow-[0_28px_55px_rgb(68_60_56_/_0.16)] rotate-[-3deg]">
            <div class="aspect-square bg-calico-300 quilt-piece quilt-piece-lines" />
            <div class="aspect-square bg-sky-300 quilt-piece quilt-piece-star" />
            <div class="aspect-square bg-meadow-300 quilt-piece quilt-piece-star" />
            <div class="aspect-square bg-petal-300 quilt-piece quilt-piece-lines" />
          </div>

          <div class="relative z-10 flex items-end justify-between">
            <span class="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">Quiltly / 01</span>
            <LandingPatch size="sm" />
          </div>
        </div>

        <div class="flex min-w-0 flex-col bg-elevated">
          <div class="flex items-center justify-between border-b border-default/70 px-5 py-4 sm:px-7">
            <div
              class="flex gap-2"
              role="progressbar"
              :aria-valuenow="step + 1"
              :aria-valuemin="1"
              :aria-valuemax="steps.length"
              :aria-label="`Onboarding step ${step + 1} of ${steps.length}`"
            >
              <span
                v-for="(_, index) in steps"
                :key="index"
                class="h-1.5 rounded-full transition-all duration-300"
                :class="index <= step ? 'w-8 bg-primary' : 'w-4 bg-accented'"
              />
            </div>
            <span class="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
              {{ step + 1 }} / {{ steps.length }}
            </span>
          </div>

          <div class="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 sm:py-10">
            <Transition
              name="tour-step"
              mode="out-in"
            >
              <div :key="step">
                <div
                  class="mb-6 flex size-14 items-center justify-center rounded-full"
                  :class="toneClasses"
                >
                  <UIcon
                    :name="current.icon"
                    class="size-6"
                  />
                </div>

                <p class="editorial-label text-calico-700">
                  {{ current.eyebrow }}
                </p>
                <h2 class="mt-3 text-3xl font-medium leading-[1.05] tracking-[-0.045em] text-highlighted sm:text-4xl">
                  {{ displayTitle }}
                </h2>
                <p class="mt-5 max-w-lg text-lg leading-7 text-toned">
                  {{ current.description }}
                </p>

                <div
                  v-if="step > 0"
                  class="mt-7 flex items-center gap-3 border-t border-dashed border-accented pt-5"
                >
                  <UIcon
                    name="i-lucide-mouse-pointer-click"
                    class="size-4 shrink-0 text-primary"
                  />
                  <p class="font-mono text-xs leading-5 text-muted">
                    Use the Create menu anytime to add a project, supply, or bookmark.
                  </p>
                </div>
              </div>
            </Transition>
          </div>

          <div class="flex items-center justify-between gap-3 border-t border-default/70 px-5 py-4 sm:px-7">
            <UButton
              v-if="step === 0"
              label="Skip tour"
              color="neutral"
              variant="ghost"
              :disabled="saving"
              @click="completeTour"
            />
            <UButton
              v-else
              label="Back"
              icon="i-lucide-arrow-left"
              color="neutral"
              variant="ghost"
              :disabled="saving"
              @click="previous"
            />

            <UButton
              v-if="!isLastStep"
              label="Next patch"
              trailing-icon="i-lucide-arrow-right"
              @click="next"
            />
            <UButton
              v-else
              label="Start exploring"
              trailing-icon="i-lucide-sparkles"
              :loading="saving"
              @click="completeTour"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.onboarding-swatch {
  background:
    radial-gradient(circle at 82% 14%, rgb(255 255 255 / 0.58), transparent 12rem),
    linear-gradient(145deg, var(--color-muslin-100), var(--color-calico-100));
}

.onboarding-swatch::before {
  position: absolute;
  inset: 0;
  content: '';
  opacity: 0.28;
  background-image: repeating-linear-gradient(45deg, transparent 0 10px, rgb(74 64 58 / 0.04) 10px 11px);
}

.quilt-piece {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.65);
}

.quilt-piece-lines::after {
  position: absolute;
  inset: -35%;
  content: '';
  border: 18px solid rgb(255 249 237 / 0.5);
  transform: rotate(45deg);
}

.quilt-piece-star::after {
  position: absolute;
  inset: 25%;
  content: '';
  background: rgb(255 249 237 / 0.72);
  transform: rotate(45deg);
}

.tour-step-enter-active,
.tour-step-leave-active {
  transition: opacity 180ms ease, transform 220ms ease;
}

.tour-step-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.tour-step-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .tour-step-enter-active,
  .tour-step-leave-active {
    transition: none;
  }
}
</style>
