<script setup lang="ts">
import QuiltlyEmailFrame from '../components/email/QuiltlyEmailFrame.vue'

defineProps<{
  actionUrl: string
}>()
</script>

<template>
  <QuiltlyEmailFrame
    subject="Reset your Quiltly password"
    preview="Use this secure link to choose a new password."
    kicker="Account access"
    title="Reset your password"
    :action-url="actionUrl"
    action-label="Reset password"
  >
    <p style="margin: 0;">
      Use the button below to choose a new password.
    </p>

    <template #note>
      Didn’t request this? You can ignore this email.
    </template>
  </QuiltlyEmailFrame>
</template>
