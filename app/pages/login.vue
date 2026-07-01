<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const toast = useToast()
const signInEmail = useSignIn('email')
const signUpEmail = useSignUp('email')

const mode = ref<'login' | 'register'>(route.query.mode === 'register' ? 'register' : 'login')
const loading = ref(false)
const state = reactive({ name: '', email: '', password: '' })

const schema = computed(() => mode.value === 'register'
  ? z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      password: z.string().min(8, 'Min 8 characters')
    })
  : z.object({
      email: z.string().email('Invalid email'),
      password: z.string().min(1, 'Password is required')
    }))

function redirectTarget() {
  const redirect = route.query.redirect as string
  if (!redirect?.startsWith('/') || redirect.startsWith('//')) return '/dashboard'
  return redirect
}

async function onSubmit() {
  loading.value = true
  try {
    if (mode.value === 'login') {
      await signInEmail.execute({ email: state.email, password: state.password })
      if (signInEmail.error.value) {
        toast.add({ title: 'Sign in failed', description: signInEmail.error.value.message, color: 'error' })
      } else {
        await navigateTo(redirectTarget())
      }
    } else {
      await signUpEmail.execute({ name: state.name, email: state.email, password: state.password })
      if (signUpEmail.error.value) {
        toast.add({ title: 'Sign up failed', description: signUpEmail.error.value.message, color: 'error' })
      } else {
        await navigateTo(redirectTarget())
      }
    }
  } catch (e) {
    toast.add({ title: 'Something went wrong', description: (e as Error).message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-sm">
    <template #header>
      <div class="text-center">
        <h1 class="text-2xl font-semibold">
          {{ mode === 'login' ? 'Welcome back' : 'Create your account' }}
        </h1>
        <p class="text-sm text-muted mt-1">
          {{ mode === 'login' ? 'Sign in to your quilting workspace' : 'Start tracking your quilting projects' }}
        </p>
      </div>
    </template>

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
          class="w-full"
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
          icon="i-lucide-mail"
          class="w-full"
        />
      </UFormField>

      <UFormField
        name="password"
        label="Password"
        required
      >
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
          icon="i-lucide-lock"
          class="w-full"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        :loading="loading"
        :label="mode === 'login' ? 'Sign in' : 'Create account'"
      />
    </UForm>

    <template #footer>
      <div class="text-center text-sm text-muted">
        <template v-if="mode === 'login'">
          Don't have an account?
          <UButton
            variant="link"
            class="p-0 align-baseline"
            label="Sign up"
            @click="mode = 'register'"
          />
        </template>
        <template v-else>
          Already have an account?
          <UButton
            variant="link"
            class="p-0 align-baseline"
            label="Sign in"
            @click="mode = 'login'"
          />
        </template>
      </div>
    </template>
  </UCard>
</template>
