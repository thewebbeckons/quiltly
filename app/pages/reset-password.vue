<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const resetPassword = useAuthClientAction(client => client.resetPassword)
const complete = ref(false)
const showPassword = ref(false)
const formError = ref('')
const token = computed(() => typeof route.query.token === 'string' ? route.query.token : '')
const invalidToken = computed(() => route.query.error === 'INVALID_TOKEN' || !token.value)
const state = reactive({ password: '', confirmPassword: '' })

const schema = z.object({
  password: z.string()
    .min(8, 'Use at least 8 characters')
    .max(128, 'Keep your password under 128 characters')
    .regex(/[A-Za-z]/, 'Add at least one letter')
    .regex(/\d/, 'Add at least one number'),
  confirmPassword: z.string()
}).refine(value => value.password === value.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

const passwordChecks = computed(() => [
  { label: '8+ characters', met: state.password.length >= 8 },
  { label: 'one letter', met: /[A-Za-z]/.test(state.password) },
  { label: 'one number', met: /\d/.test(state.password) }
])

async function onSubmit() {
  formError.value = ''
  await resetPassword.execute({
    newPassword: state.password,
    token: token.value
  })

  if (resetPassword.error.value) {
    formError.value = resetPassword.error.value.code === 'INVALID_TOKEN'
      ? 'This reset link has expired. Request a new one from your settings.'
      : resetPassword.error.value.message
    return
  }

  state.password = ''
  state.confirmPassword = ''
  complete.value = true
}
</script>

<template>
  <UCard class="w-full max-w-lg">
    <div
      v-if="complete"
      class="px-2 py-8 text-center sm:px-5 sm:py-10"
    >
      <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-meadow-100 text-meadow-700">
        <UIcon
          name="i-lucide-shield-check"
          class="size-7"
        />
      </div>
      <p class="mt-6 editorial-label text-primary">
        All set
      </p>
      <h1 class="mt-3 text-4xl font-medium tracking-[-0.05em] text-highlighted">
        Password updated.
      </h1>
      <UButton
        to="/login"
        label="Sign in to Quiltly"
        trailing-icon="i-lucide-arrow-right"
        size="lg"
        class="mt-7"
      />
    </div>

    <div
      v-else-if="invalidToken"
      class="px-2 py-8 text-center sm:px-5 sm:py-10"
    >
      <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-marigold-100 text-marigold-700">
        <UIcon
          name="i-lucide-link-2-off"
          class="size-7"
        />
      </div>
      <p class="mt-6 editorial-label text-primary">
        Reset link
      </p>
      <h1 class="mt-3 text-4xl font-medium tracking-[-0.05em] text-highlighted">
        This link has expired.
      </h1>
      <UButton
        to="/login"
        label="Back to sign in"
        color="neutral"
        variant="outline"
        class="mt-7"
      />
    </div>

    <div
      v-else
      class="p-2 sm:p-3"
    >
      <div class="border-b border-dashed border-accented px-3 pb-6 pt-3 sm:px-5 sm:pt-5">
        <p class="editorial-label text-primary">
          Account security
        </p>
        <h1 class="mt-3 text-4xl font-medium tracking-[-0.05em] text-highlighted">
          Set a new password.
        </h1>
      </div>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 px-3 pb-3 pt-6 sm:px-5 sm:pb-5"
        @submit="onSubmit"
      >
        <UFormField
          name="password"
          label="New password"
          required
        >
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            icon="i-lucide-lock-keyhole"
            class="w-full"
            :disabled="resetPassword.status.value === 'pending'"
          >
            <template #trailing>
              <UButton
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                color="neutral"
                variant="link"
                size="xs"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>

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

        <UFormField
          name="confirmPassword"
          label="Confirm password"
          required
        >
          <UInput
            v-model="state.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            icon="i-lucide-lock-keyhole"
            class="w-full"
            :disabled="resetPassword.status.value === 'pending'"
          />
        </UFormField>

        <div
          v-if="formError"
          class="flex items-start gap-2 bg-error/8 px-3 py-2.5 text-sm text-error ring-1 ring-inset ring-error/20"
          role="alert"
          aria-live="polite"
        >
          <UIcon
            name="i-lucide-circle-alert"
            class="mt-0.5 size-4 shrink-0"
          />
          <span>{{ formError }}</span>
        </div>

        <UButton
          type="submit"
          block
          size="lg"
          label="Update password"
          trailing-icon="i-lucide-arrow-right"
          :loading="resetPassword.status.value === 'pending'"
        />
      </UForm>
    </div>
  </UCard>
</template>
