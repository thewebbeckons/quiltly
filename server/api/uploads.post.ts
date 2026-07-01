import { blob } from 'hub:blob'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  return blob.handleUpload(event, {
    formKey: 'file',
    multiple: false,
    ensure: { maxSize: '8MB', types: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] },
    put: { prefix: `uploads/${user.id}`, addRandomSuffix: true }
  })
})
