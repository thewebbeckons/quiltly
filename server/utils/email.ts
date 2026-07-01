import type { H3Event } from 'h3'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text: string
}

type EmailBinding = { send: (m: unknown) => Promise<unknown> }

function getEmailBinding(source?: H3Event | Request): EmailBinding | undefined {
  if (!source || source instanceof Request) return undefined
  return (source.context as { cloudflare?: { env?: { EMAIL?: EmailBinding } } }).cloudflare?.env?.EMAIL
}

export async function sendEmail(opts: SendEmailOptions, source?: H3Event | Request): Promise<void> {
  const config = useRuntimeConfig()
  const from = config.emailFrom as string
  const fromName = 'Quiltly'

  const binding = getEmailBinding(source)
  if (binding && typeof binding.send === 'function') {
    try {
      await binding.send({
        to: opts.to,
        from: { email: from, name: fromName },
        subject: opts.subject,
        html: opts.html,
        text: opts.text
      })
      return
    } catch (error) {
      console.error('[email] binding send failed, falling back to REST:', error)
    }
  }

  const accountId = config.cfAccountId as string | undefined
  const token = config.cfEmailApiToken as string | undefined

  if (!accountId || !token) {
    if (import.meta.dev) {
      const to = Array.isArray(opts.to) ? opts.to.join(', ') : opts.to
      console.warn(`[dev:email] no CF credentials -> to=${to} subject="${opts.subject}"`)
      console.warn(opts.text)
      return
    }
    throw new Error('[email] missing NUXT_CF_ACCOUNT_ID / NUXT_CF_EMAIL_API_TOKEN')
  }

  try {
    await $fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: {
        to: opts.to,
        from: { address: from, name: fromName },
        subject: opts.subject,
        html: opts.html,
        text: opts.text
      }
    })
  } catch (error) {
    console.error('[email] REST send failed:', error)
    throw error
  }
}
