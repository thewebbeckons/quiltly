import { blob } from 'hub:blob'

export default defineEventHandler(async (event) => {
  const pathname = (getRouterParam(event, 'pathname') || '').replace(/^\//, '')
  if (!pathname) throw createError({ statusCode: 400, statusMessage: 'No file path' })
  return blob.serve(event, pathname)
})
