import { defineServerAuth } from '@onmax/nuxt-better-auth/config'
import { sendEmail } from '~~/server/utils/email'

export default defineServerAuth(() => ({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your Quiltly password',
        text: `Click the link to reset your Quiltly password: ${url}`,
        html: `<p>Click <a href="${url}">here</a> to reset your Quiltly password.</p>`
      }, request)
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your Quiltly email',
        text: `Click the link to verify your email: ${url}`,
        html: `<p>Click <a href="${url}">here</a> to verify your Quiltly email address.</p>`
      }, request)
    }
  },
  socialProviders: {}
}))
