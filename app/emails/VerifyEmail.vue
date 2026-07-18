<script setup lang="ts">
import QuiltlyEmailFrame from '../components/email/QuiltlyEmailFrame.vue'

defineProps<{
  actionUrl: string
}>()
</script>

<template>
  <QuiltlyEmailFrame
    subject="Verify your Quiltly email"
    preview="One click to finish setting up your Quiltly account."
    kicker="Account setup"
    title="Confirm your email"
    :action-url="actionUrl"
    action-label="Verify email"
  >
    <p style="margin: 0;">
      Verify your email to start organizing your quilting workspace.
    </p>

    <template #note>
      If you didn’t create a Quiltly account, you can ignore this email.
    </template>
  </QuiltlyEmailFrame>
</template>
