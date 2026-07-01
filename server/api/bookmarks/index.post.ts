import { db, schema } from 'hub:db'
import { fetchLinkMeta } from '~~/server/utils/link-preview'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readValidatedBody(event, bookmarkCreateSchema.parse)

  let meta = {
    title: body.title ?? null,
    description: body.description ?? null,
    siteName: body.siteName ?? null,
    favicon: body.favicon ?? null,
    ogImage: body.ogImage ?? null
  }

  if (!meta.title) {
    meta = { ...meta, ...(await fetchLinkMeta(body.url)) }
  }

  const now = new Date()
  try {
    const [bookmark] = await db.insert(schema.bookmarks).values({
      userId: user.id,
      url: body.url,
      title: meta.title,
      description: meta.description,
      siteName: meta.siteName,
      favicon: meta.favicon,
      ogImage: meta.ogImage,
      imagePath: body.imagePath,
      tags: body.tags ?? [],
      notes: body.notes,
      favorite: body.favorite ?? false,
      createdAt: now,
      updatedAt: now
    }).returning()
    return bookmark
  } catch (error) {
    if (String(error).includes('UNIQUE')) {
      throw createError({ statusCode: 409, statusMessage: 'Bookmark already exists' })
    }
    throw error
  }
})
