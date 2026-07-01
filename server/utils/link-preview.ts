import { createError } from 'h3'

interface LinkMeta {
  title: string | null
  description: string | null
  siteName: string | null
  favicon: string | null
  ogImage: string | null
}

function metaContent(html: string, keys: string[]): string | null {
  const metas = html.match(/<meta[^>]*>/gi) || []
  for (const tag of metas) {
    for (const key of keys) {
      const hasKey = new RegExp(`(?:property|name)=["']${key}["']`, 'i').test(tag)
      if (hasKey) {
        const content = tag.match(/content=["']([^"']+)["']/i)
        if (content?.[1]) return content[1].trim()
      }
    }
  }
  return null
}

function resolveUrl(base: string, href: string | null): string | null {
  if (!href) return null
  try {
    return new URL(href, base).href
  } catch {
    return null
  }
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^\[|\]$/g, '')
}

function isPrivateIPv4(hostname: string): boolean {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) return false
  const parts = hostname.split('.').map(Number)
  if (parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return true
  const a = parts[0] as number
  const b = parts[1] as number
  return a === 0
    || a === 10
    || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 198 && (b === 18 || b === 19))
    || a >= 224
}

function isPrivateIPv6(hostname: string): boolean {
  return hostname === '::1'
    || hostname === '::'
    || hostname.startsWith('fc')
    || hostname.startsWith('fd')
    || hostname.startsWith('fe80:')
}

function assertSafePreviewUrl(url: string): URL {
  const parsed = new URL(url)
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw createError({ statusCode: 422, statusMessage: 'URL must use http or https' })
  }

  const hostname = normalizeHostname(parsed.hostname)
  if (
    hostname === 'localhost'
    || hostname.endsWith('.localhost')
    || !hostname.includes('.')
    || isPrivateIPv4(hostname)
    || isPrivateIPv6(hostname)
  ) {
    throw createError({ statusCode: 422, statusMessage: 'URL host is not allowed' })
  }

  return parsed
}

async function readLimitedText(response: Response, maxBytes: number): Promise<string | null> {
  const contentLength = Number(response.headers.get('content-length') || 0)
  if (contentLength > maxBytes) return null

  if (!response.body) return response.text()

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    if (received > maxBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }

  const body = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  return new TextDecoder().decode(body)
}

export async function fetchLinkMeta(rawUrl: string): Promise<LinkMeta> {
  const empty: LinkMeta = { title: null, description: null, siteName: null, favicon: null, ogImage: null }
  let base: string
  try {
    base = assertSafePreviewUrl(rawUrl).href
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode) throw error
    return empty
  }

  const html = await Promise.race([
    fetch(base, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; QuiltlyBot/1.0)'
      },
      redirect: 'follow'
    }),
    new Promise<null>(resolve => setTimeout(() => resolve(null), 8000))
  ]).then(async (response) => {
    if (!response?.ok) return null
    try {
      assertSafePreviewUrl(response.url)
    } catch {
      return null
    }

    const contentType = response.headers.get('content-type') || ''
    if (!/^text\/html\b|^application\/xhtml\+xml\b/i.test(contentType)) return null

    return readLimitedText(response, 1024 * 1024)
  }).catch(() => null)

  if (!html) return { ...empty, title: null }

  const title = metaContent(html, ['og:title', 'twitter:title'])
    ?? (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || null)
  const description = metaContent(html, ['og:description', 'twitter:description', 'description'])
  const siteName = metaContent(html, ['og:site_name'])
  const ogImage = resolveUrl(base, metaContent(html, ['og:image', 'twitter:image']))
  const faviconHref = (html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i)?.[1]) || null
  const favicon = resolveUrl(base, faviconHref) ?? (new URL('/favicon.ico', base).href)

  return { title, description, siteName, favicon, ogImage }
}
