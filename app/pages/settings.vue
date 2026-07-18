<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()
const { user, updateUser, fetchSession } = useUserSession()
const { show: showOnboardingTour } = useOnboardingTour()
const changeEmail = useAuthClientAction(client => client.changeEmail)
const changePassword = useAuthClientAction(client => client.changePassword)

const nameSaving = ref(false)
const showPasswords = ref(false)
const nameState = reactive({ name: user.value?.name || '' })
const emailState = reactive({ email: user.value?.email || '' })
const passwordState = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const nameSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters').max(60, 'Keep your name under 60 characters')
})

const emailSchema = z.object({
  email: z.string().trim().email('Enter a valid email address')
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password'),
  newPassword: z.string()
    .min(8, 'Use at least 8 characters')
    .max(128, 'Keep your password under 128 characters')
    .regex(/[A-Za-z]/, 'Add at least one letter')
    .regex(/\d/, 'Add at least one number'),
  confirmPassword: z.string()
}).refine(value => value.newPassword === value.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

const passwordChecks = computed(() => [
  { label: '8+ characters', met: passwordState.newPassword.length >= 8 },
  { label: 'one letter', met: /[A-Za-z]/.test(passwordState.newPassword) },
  { label: 'one number', met: /\d/.test(passwordState.newPassword) }
])

const initials = computed(() => {
  const parts = (user.value?.name || user.value?.email || 'Q').trim().split(/\s+/)
  return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase()
})

watch(user, (current) => {
  if (!current) return
  nameState.name = current.name || ''
  emailState.email = current.email
}, { immediate: true })

function friendlyError(message?: string, code?: string) {
  if (code === 'INVALID_PASSWORD') return 'Your current password is not correct.'
  if (code === 'CREDENTIAL_ACCOUNT_NOT_FOUND') return 'This account does not have a password to update.'
  if (code === 'USER_ALREADY_EXISTS') return 'That email is already in use.'
  if (code === 'SESSION_EXPIRED') return 'Please sign in again before changing this setting.'
  return message || 'We could not complete that request. Please try again.'
}

async function saveName() {
  const nextName = nameState.name.trim()
  if (nextName === user.value?.name) return

  nameSaving.value = true
  try {
    await updateUser({ name: nextName })
    toast.add({
      title: 'Name updated',
      color: 'success',
      icon: 'i-lucide-circle-check'
    })
  } catch (error) {
    toast.add({
      title: 'Name could not be updated',
      description: error instanceof Error ? error.message : undefined,
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
  } finally {
    nameSaving.value = false
  }
}

async function saveEmail() {
  const nextEmail = emailState.email.trim().toLowerCase()
  if (nextEmail === user.value?.email) return

  await changeEmail.execute({
    newEmail: nextEmail,
    callbackURL: '/settings'
  })

  if (changeEmail.error.value) {
    toast.add({
      title: 'Email could not be updated',
      description: friendlyError(changeEmail.error.value.message, changeEmail.error.value.code),
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
    return
  }

  toast.add({
    title: 'Check your inbox',
    description: `We sent a verification link to ${nextEmail}.`,
    color: 'info',
    icon: 'i-lucide-mail-check'
  })
}

async function savePassword() {
  await changePassword.execute({
    currentPassword: passwordState.currentPassword,
    newPassword: passwordState.newPassword,
    revokeOtherSessions: true
  })

  if (changePassword.error.value) {
    toast.add({
      title: 'Password could not be updated',
      description: friendlyError(changePassword.error.value.message, changePassword.error.value.code),
      color: 'error',
      icon: 'i-lucide-circle-alert'
    })
    return
  }

  passwordState.currentPassword = ''
  passwordState.newPassword = ''
  passwordState.confirmPassword = ''
  showPasswords.value = false
  await fetchSession({ force: true })
  toast.add({
    title: 'Password updated',
    description: 'Other sessions have been signed out.',
    color: 'success',
    icon: 'i-lucide-shield-check'
  })
}
</script>

<template>
  <UContainer class="space-y-8 pb-10">
    <AppPageHeader
      eyebrow="Your account"
      title="Profile & settings."
      description="Keep your Quiltly account current."
      icon="i-lucide-user-round-cog"
      tone="sky"
      meta="Account details"
    />

    <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div class="space-y-5">
        <UCard class="settings-card">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex size-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <UIcon
                  name="i-lucide-id-card"
                  class="size-[1.15rem]"
                />
              </div>
              <div>
                <p class="editorial-label text-muted">
                  Profile
                </p>
                <h2 class="mt-1 text-2xl text-highlighted">
                  Your details
                </h2>
              </div>
            </div>
          </template>

          <div class="divide-y divide-dashed divide-accented">
            <UForm
              :schema="nameSchema"
              :state="nameState"
              class="grid gap-4 pb-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
              @submit="saveName"
            >
              <UFormField
                name="name"
                label="Name"
                required
              >
                <UInput
                  v-model="nameState.name"
                  autocomplete="name"
                  icon="i-lucide-user-round"
                  class="w-full"
                  :disabled="nameSaving"
                />
              </UFormField>
              <UButton
                type="submit"
                label="Save name"
                :loading="nameSaving"
                :disabled="nameState.name.trim() === user?.name"
              />
            </UForm>

            <UForm
              :schema="emailSchema"
              :state="emailState"
              class="grid gap-4 pt-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
              @submit="saveEmail"
            >
              <UFormField
                name="email"
                label="Email"
                required
              >
                <UInput
                  v-model="emailState.email"
                  type="email"
                  autocomplete="email"
                  inputmode="email"
                  autocapitalize="none"
                  spellcheck="false"
                  icon="i-lucide-mail"
                  class="w-full"
                  :disabled="changeEmail.status.value === 'pending'"
                />
                <span
                  v-if="user?.emailVerified"
                  class="mt-2 flex items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.07em] text-meadow-700"
                >
                  <UIcon
                    name="i-lucide-badge-check"
                    class="size-3.5"
                  />
                  Verified email
                </span>
              </UFormField>
              <UButton
                type="submit"
                label="Update email"
                color="neutral"
                variant="outline"
                :loading="changeEmail.status.value === 'pending'"
                :disabled="emailState.email.trim().toLowerCase() === user?.email"
              />
            </UForm>
          </div>
        </UCard>

        <UCard class="settings-card">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex size-10 items-center justify-center rounded-full bg-meadow-100 text-meadow-700">
                <UIcon
                  name="i-lucide-shield-check"
                  class="size-[1.15rem]"
                />
              </div>
              <div>
                <p class="editorial-label text-muted">
                  Security
                </p>
                <h2 class="mt-1 text-2xl text-highlighted">
                  Password
                </h2>
              </div>
            </div>
          </template>

          <UForm
            :schema="passwordSchema"
            :state="passwordState"
            class="space-y-4"
            @submit="savePassword"
          >
            <UFormField
              name="currentPassword"
              label="Current password"
              required
            >
              <UInput
                v-model="passwordState.currentPassword"
                :type="showPasswords ? 'text' : 'password'"
                autocomplete="current-password"
                icon="i-lucide-key-round"
                class="w-full"
                :disabled="changePassword.status.value === 'pending'"
              />
            </UFormField>

            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField
                name="newPassword"
                label="New password"
                required
              >
                <UInput
                  v-model="passwordState.newPassword"
                  :type="showPasswords ? 'text' : 'password'"
                  autocomplete="new-password"
                  icon="i-lucide-lock-keyhole"
                  class="w-full"
                  :disabled="changePassword.status.value === 'pending'"
                >
                  <template #trailing>
                    <UButton
                      :icon="showPasswords ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                      :aria-label="showPasswords ? 'Hide passwords' : 'Show passwords'"
                      color="neutral"
                      variant="link"
                      size="xs"
                      @click="showPasswords = !showPasswords"
                    />
                  </template>
                </UInput>
              </UFormField>

              <UFormField
                name="confirmPassword"
                label="Confirm new password"
                required
              >
                <UInput
                  v-model="passwordState.confirmPassword"
                  :type="showPasswords ? 'text' : 'password'"
                  autocomplete="new-password"
                  icon="i-lucide-lock-keyhole"
                  class="w-full"
                  :disabled="changePassword.status.value === 'pending'"
                />
              </UFormField>
            </div>

            <div
              class="flex flex-wrap gap-x-4 gap-y-2"
              role="group"
              aria-label="Password requirements"
            >
              <span
                v-for="check in passwordChecks"
                :key="check.label"
                class="flex items-center gap-1.5 font-mono text-[0.68rem]"
                :class="check.met ? 'text-meadow-700' : 'text-muted'"
              >
                <UIcon
                  :name="check.met ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                  class="size-3.5"
                />
                {{ check.label }}
              </span>
            </div>

            <div class="flex justify-end border-t border-dashed border-accented pt-5">
              <UButton
                type="submit"
                label="Update password"
                icon="i-lucide-shield-check"
                :loading="changePassword.status.value === 'pending'"
              />
            </div>
          </UForm>
        </UCard>
      </div>

      <aside class="space-y-5">
        <UCard
          class="settings-sampler relative overflow-hidden"
          :ui="{ body: 'p-0 sm:p-0' }"
        >
          <div class="relative p-6">
            <div class="relative z-10 flex items-center gap-4">
              <div class="grid size-14 shrink-0 place-items-center rounded-full bg-elevated text-xl font-medium text-highlighted shadow-sm ring-1 ring-default">
                {{ initials }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-xl font-medium text-highlighted">
                  {{ user?.name }}
                </p>
                <p class="mt-1 truncate font-mono text-[0.68rem] text-muted">
                  {{ user?.email }}
                </p>
              </div>
            </div>
          </div>
        </UCard>

        <UCard class="settings-card">
          <div class="flex items-start gap-4">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-calico-100 text-calico-700">
              <UIcon
                name="i-lucide-sparkles"
                class="size-[1.15rem]"
              />
            </div>
            <div>
              <h2 class="text-2xl text-highlighted">
                Welcome tour
              </h2>
              <p class="mt-2 text-sm leading-6 text-muted">
                Revisit the Quiltly basics.
              </p>
            </div>
          </div>
          <UButton
            label="View welcome tour"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-right"
            class="mt-5 w-full justify-between"
            @click="showOnboardingTour"
          />
        </UCard>
      </aside>
    </div>
  </UContainer>
</template>

<style scoped>
.settings-card {
  box-shadow: 0 22px 55px rgb(68 60 56 / 0.06);
}

.settings-sampler {
  background:
    radial-gradient(circle at 88% 12%, rgb(255 255 255 / 0.7), transparent 9rem),
    linear-gradient(145deg, var(--color-sky-100), var(--color-calico-100));
}

.settings-sampler::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  opacity: 0.22;
  background-image: repeating-linear-gradient(45deg, transparent 0 11px, rgb(74 64 58 / 0.05) 11px 12px);
}
</style>
