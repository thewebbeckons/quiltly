import { fetchLinkMeta } from '~~/server/utils/link-preview'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const { url } = await readValidatedBody(event, bookmarkPreviewSchema.parse)
  return fetchLinkMeta(url)
})
