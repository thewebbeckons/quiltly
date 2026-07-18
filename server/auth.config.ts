import { defineServerAuth } from '@onmax/nuxt-better-auth/config'
import { renderTransactionalEmail, sendEmail } from '~~/server/utils/email'

export default defineServerAuth(() => ({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }, request) => {
      const email = await renderTransactionalEmail('ResetPassword', { actionUrl: url })

      await sendEmail({
        to: user.email,
        ...email
      }, request)
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }, request) => {
      const email = await renderTransactionalEmail('VerifyEmail', { actionUrl: url })

      await sendEmail({
        to: user.email,
        ...email
      }, request)
    }
  },
  user: {
    changeEmail: {
      enabled: true
    }
  },
  socialProviders: {}
}))
