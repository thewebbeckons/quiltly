import { marked, Renderer } from 'marked'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;')
}

function safeLink(value: string): string | undefined {
  return /^(https?:\/\/|mailto:|\/|#)/i.test(value) ? value : undefined
}

function createSafeRenderer(): Renderer {
  const renderer = new Renderer()

  renderer.html = ({ text }) => escapeHtml(text)
  renderer.link = ({ href, title, tokens }) => {
    const safeHref = safeLink(href)
    const label = renderer.parser.parseInline(tokens)
    if (!safeHref) return label
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : ''
    return `<a href="${escapeHtml(safeHref)}"${titleAttribute}>${label}</a>`
  }
  renderer.image = ({ href, title, text }) => {
    const safeHref = safeLink(href)
    if (!safeHref || safeHref.startsWith('mailto:') || safeHref.startsWith('#')) return escapeHtml(text)
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : ''
    return `<img src="${escapeHtml(safeHref)}" alt="${escapeHtml(text)}"${titleAttribute}>`
  }

  return renderer
}

export function renderMarkdown(source: string): string {
  return marked.parse(source, {
    async: false,
    renderer: createSafeRenderer()
  }) as string
}
