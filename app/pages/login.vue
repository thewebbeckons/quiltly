<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const toast = useToast()
const signInEmail = useSignIn('email')
const signUpEmail = useSignUp('email')
const resendVerification = useAuthClientAction(client => client.sendVerificationEmail)

const mode = ref<'login' | 'register'>(route.query.mode === 'register' ? 'register' : 'login')
const screen = ref<'form' | 'verify'>('form')
const loading = ref(false)
const showPassword = ref(false)
const formError = ref('')
const registeredEmail = ref('')
const resendCooldown = ref(0)
const state = reactive({ name: '', email: '', password: '', confirmPassword: '' })
let resendTimer: ReturnType<typeof setInterval> | undefined

const passwordChecks = computed(() => [
  { label: '8+ characters', met: state.password.length >= 8 },
  { label: 'one letter', met: /[A-Za-z]/.test(state.password) },
  { label: 'one number', met: /\d/.test(state.password) }
])

const schema = computed(() => mode.value === 'register'
  ? z.object({
      name: z.string().trim().min(2, 'Enter at least 2 characters').max(60, 'Keep your name under 60 characters'),
      email: z.string().trim().email('Enter a valid email address'),
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
  : z.object({
      email: z.string().trim().email('Enter a valid email address'),
      password: z.string().min(1, 'Enter your password')
    }))

function redirectTarget() {
  const redirect = route.query.redirect as string
  if (!redirect?.startsWith('/') || redirect.startsWith('//')) return '/dashboard'
  return redirect
}

function friendlyError(message?: string, code?: string) {
  if (code === 'INVALID_EMAIL_OR_PASSWORD') return 'That email and password combination is not recognized.'
  if (code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') return 'An account with that email already exists. Try signing in instead.'
  if (code === 'PASSWORD_TOO_SHORT') return 'Use at least 8 characters for your password.'
  return message || 'We could not complete that request. Please try again.'
}

function switchMode(nextMode: 'login' | 'register') {
  mode.value = nextMode
  screen.value = 'form'
  formError.value = ''
  state.password = ''
  state.confirmPassword = ''
  showPassword.value = false
}

function startResendCooldown() {
  resendCooldown.value = 30
  if (resendTimer) clearInterval(resendTimer)
  resendTimer = setInterval(() => {
    resendCooldown.value -= 1
    if (resendCooldown.value <= 0 && resendTimer) {
      clearInterval(resendTimer)
      resendTimer = undefined
    }
  }, 1000)
}

async function onSubmit() {
  loading.value = true
  formError.value = ''
  const email = state.email.trim().toLowerCase()

  try {
    if (mode.value === 'login') {
      await signInEmail.execute({ email, password: state.password })
      if (signInEmail.error.value) {
        if (signInEmail.error.value.code === 'EMAIL_NOT_VERIFIED') {
          registeredEmail.value = email
          screen.value = 'verify'
          startResendCooldown()
          return
        }
        formError.value = friendlyError(signInEmail.error.value.message, signInEmail.error.value.code)
        return
      }
      await navigateTo(redirectTarget())
      return
    }

    await signUpEmail.execute({
      name: state.name.trim(),
      email,
      password: state.password,
      callbackURL: redirectTarget()
    })

    if (signUpEmail.error.value) {
      formError.value = friendlyError(signUpEmail.error.value.message, signUpEmail.error.value.code)
      return
    }

    registeredEmail.value = email
    state.password = ''
    state.confirmPassword = ''
    screen.value = 'verify'
    startResendCooldown()
  } catch {
    formError.value = 'Something interrupted the request. Check your connection and try again.'
  } finally {
    loading.value = false
  }
}

async function onResendVerification() {
  if (resendCooldown.value > 0) return

  await resendVerification.execute({
    email: registeredEmail.value,
    callbackURL: redirectTarget()
  })

  if (resendVerification.error.value) {
    toast.add({
      title: 'Email could not be sent',
      description: friendlyError(resendVerification.error.value.message, resendVerification.error.value.code),
      color: 'error'
    })
    return
  }

  startResendCooldown()
  toast.add({
    title: 'Verification email sent',
    description: `A fresh link is on its way to ${registeredEmail.value}.`,
    color: 'success',
    icon: 'i-lucide-send'
  })
}

onBeforeUnmount(() => {
  if (resendTimer) clearInterval(resendTimer)
})
</script>

<template>
  <UCard
    class="w-full max-w-4xl"
    :ui="{ body: 'p-0 sm:p-0', footer: 'p-0 sm:p-0' }"
  >
    <div class="grid min-h-[34rem] md:grid-cols-[0.9fr_1.1fr]">
      <aside class="auth-sampler relative hidden overflow-hidden border-r border-default p-8 md:flex md:flex-col md:justify-between">
        <div class="relative z-10">
          <p class="editorial-label text-calico-800">
            Your quilting workspace
          </p>
          <p class="mt-4 max-w-xs text-4xl font-medium leading-[1.02] tracking-[-0.05em] text-highlighted">
            Keep the whole quilt in view.
          </p>
          <p class="mt-4 max-w-xs text-base leading-6 text-toned">
            Materials, patterns, progress, and inspiration—pieced together in one calm place.
          </p>
        </div>

        <div class="relative z-10 grid grid-cols-2 gap-px self-center bg-muslin-700/15 p-px shadow-[0_28px_60px_rgb(68_60_56_/_0.16)] rotate-2">
          <div class="size-24 bg-calico-300 auth-patch auth-patch-a" />
          <div class="size-24 bg-sky-300 auth-patch auth-patch-b" />
          <div class="size-24 bg-meadow-300 auth-patch auth-patch-b" />
          <div class="size-24 bg-petal-300 auth-patch auth-patch-a" />
        </div>

        <div class="relative z-10 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">
          <UIcon
            name="i-lucide-shield-check"
            class="size-4 text-meadow-700"
          />
          Private by default · Made for makers
        </div>
      </aside>

      <section class="flex min-w-0 flex-col bg-elevated">
        <template v-if="screen === 'form'">
          <div class="flex border-b border-default/70 p-2">
            <UButton
              label="Sign in"
              block
              :variant="mode === 'login' ? 'soft' : 'ghost'"
              :color="mode === 'login' ? 'primary' : 'neutral'"
              @click="switchMode('login')"
            />
            <UButton
              label="Create account"
              block
              :variant="mode === 'register' ? 'soft' : 'ghost'"
              :color="mode === 'register' ? 'primary' : 'neutral'"
              @click="switchMode('register')"
            />
          </div>

          <div class="flex flex-1 flex-col justify-center p-5 sm:p-8">
            <div class="mb-7">
              <p class="editorial-label text-primary">
                {{ mode === 'login' ? 'Welcome back' : 'Begin your workspace' }}
              </p>
              <h1 class="mt-3 text-3xl font-medium tracking-[-0.045em] text-highlighted sm:text-4xl">
                {{ mode === 'login' ? 'Pick up where you left off.' : 'Create your Quiltly account.' }}
              </h1>
              <p class="mt-2 text-sm text-muted">
                {{ mode === 'login' ? 'Sign in to your quilting workspace.' : 'Free to start. Verify your email, then take the guided tour.' }}
              </p>
            </div>

            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="onSubmit"
            >
              <UFormField
                v-if="mode === 'register'"
                name="name"
                label="Name"
                required
              >
                <UInput
                  v-model="state.name"
                  placeholder="Your name"
                  autocomplete="name"
                  icon="i-lucide-user-round"
                  class="w-full"
                  :disabled="loading"
                />
              </UFormField>

              <UFormField
                name="email"
                label="Email"
                required
              >
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  inputmode="email"
                  autocapitalize="none"
                  spellcheck="false"
                  icon="i-lucide-mail"
                  class="w-full"
                  :disabled="loading"
                />
              </UFormField>

              <UFormField
                name="password"
                label="Password"
                required
              >
                <UInput
                  v-model="state.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="At least 8 characters"
                  :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                  icon="i-lucide-lock-keyhole"
                  class="w-full"
                  :disabled="loading"
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
                v-if="mode === 'register'"
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
                v-if="mode === 'register'"
                name="confirmPassword"
                label="Confirm password"
                required
              >
                <UInput
                  v-model="state.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Type it once more"
                  autocomplete="new-password"
                  icon="i-lucide-lock-keyhole"
                  class="w-full"
                  :disabled="loading"
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
                :loading="loading"
                :label="mode === 'login' ? 'Sign in to Quiltly' : 'Create my account'"
                :trailing-icon="mode === 'login' ? 'i-lucide-arrow-right' : 'i-lucide-sparkles'"
              />
            </UForm>
          </div>
        </template>

        <div
          v-else
          class="flex flex-1 flex-col items-center justify-center p-6 text-center sm:p-10"
        >
          <div class="relative mb-7 flex size-20 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <UIcon
              name="i-lucide-mail-check"
              class="size-9"
            />
            <span class="absolute -right-1 -top-1 size-5 rounded-full bg-calico-300 ring-4 ring-elevated" />
          </div>

          <p class="editorial-label text-primary">
            One last stitch
          </p>
          <h1 class="mt-3 text-4xl font-medium tracking-[-0.05em] text-highlighted">
            Check your inbox.
          </h1>
          <p class="mt-4 max-w-sm text-base leading-6 text-toned">
            We sent a secure verification link to <strong class="font-medium text-highlighted">{{ registeredEmail }}</strong>. Open it to enter your workspace and begin the tour.
          </p>

          <div class="mt-8 w-full max-w-sm space-y-3">
            <UButton
              block
              color="neutral"
              variant="outline"
              icon="i-lucide-refresh-cw"
              :loading="resendVerification.status.value === 'pending'"
              :disabled="resendCooldown > 0"
              :label="resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend verification email'"
              @click="onResendVerification"
            />
            <UButton
              block
              color="neutral"
              variant="ghost"
              label="Use a different email"
              @click="switchMode('register')"
            />
          </div>

          <p class="mt-7 max-w-sm font-mono text-[0.68rem] leading-5 text-muted">
            The link may take a minute to arrive. Check your spam folder if you do not see it.
          </p>
        </div>
      </section>
    </div>
  </UCard>
</template>

<style scoped>
.auth-sampler {
  background:
    radial-gradient(circle at 15% 12%, rgb(255 255 255 / 0.62), transparent 17rem),
    linear-gradient(150deg, var(--color-muslin-100), var(--color-calico-100));
}

.auth-sampler::after {
  position: absolute;
  inset: 0;
  content: '';
  opacity: 0.25;
  background-image: repeating-linear-gradient(-45deg, transparent 0 12px, rgb(74 64 58 / 0.045) 12px 13px);
}

.auth-patch {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.75);
}

.auth-patch-a::before,
.auth-patch-b::before {
  position: absolute;
  content: '';
  background: rgb(255 249 237 / 0.68);
}

.auth-patch-a::before {
  inset: 24%;
  transform: rotate(45deg);
}

.auth-patch-b::before {
  inset: -10% 38%;
  transform: rotate(45deg);
}
</style>
