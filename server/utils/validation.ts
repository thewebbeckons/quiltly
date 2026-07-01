import { z } from 'zod'

const projectStatuses = ['planning', 'in_progress', 'paused', 'completed', 'archived'] as const
const supplyTypes = ['fabric', 'thread', 'batting', 'notion', 'tool', 'pattern', 'other'] as const

const optionalText = (max = 2000) =>
  z.preprocess(
    value => value === '' || value === null ? undefined : value,
    z.string().trim().max(max).optional()
  )

const imagePath = optionalText(500)

const metadataValue = z.union([z.string().max(500), z.number().finite(), z.boolean(), z.null()])
const supplyMetadata = z.object({
  fabric: z.object({
    width: z.coerce.number().finite().positive().optional(),
    prewashed: z.boolean().optional(),
    pattern: z.string().max(200).optional(),
    content: z.string().max(200).optional()
  }).strict().optional(),
  thread: z.object({
    weight: z.string().max(80).optional(),
    fiber: z.string().max(120).optional(),
    length: z.string().max(80).optional()
  }).strict().optional(),
  batting: z.object({
    size: z.string().max(120).optional(),
    loft: z.string().max(120).optional(),
    fiber: z.string().max(120).optional()
  }).strict().optional(),
  notion: z.object({ brand: z.string().max(120).optional() }).strict().optional(),
  tool: z.object({
    brand: z.string().max(120).optional(),
    size: z.string().max(120).optional()
  }).strict().optional(),
  pattern: z.object({
    designer: z.string().max(160).optional(),
    type: z.string().max(120).optional()
  }).strict().optional(),
  other: z.record(z.string().max(80), metadataValue).optional()
}).strict()

const supplyFields = {
  name: z.string().trim().min(1).max(160),
  type: z.enum(supplyTypes),
  quantity: z.coerce.number().finite().min(0),
  unit: optionalText(40),
  color: optionalText(80),
  lowStockThreshold: z.coerce.number().finite().min(0),
  metadata: supplyMetadata.nullish().optional(),
  notes: optionalText(5000),
  imagePath
}

export const supplyCreateSchema = z.object({
  ...supplyFields,
  quantity: supplyFields.quantity.default(0),
  lowStockThreshold: supplyFields.lowStockThreshold.default(1)
}).strict()

export const supplyPatchSchema = z.object(supplyFields).partial().refine(
  value => Object.keys(value).length > 0,
  'At least one field is required'
)

const projectFields = {
  name: z.string().trim().min(1).max(180),
  status: z.enum(projectStatuses),
  patternSource: optionalText(500),
  dueDate: z.coerce.date().optional(),
  notes: optionalText(5000),
  imagePath,
  startedAt: z.coerce.date().optional()
}

export const projectCreateSchema = z.object({
  ...projectFields,
  status: projectFields.status.default('planning')
}).strict()

export const projectPatchSchema = z.object({
  ...projectFields,
  completedAt: z.coerce.date().optional(),
  favourite: z.boolean().optional()
}).partial().refine(
  value => Object.keys(value).length > 0,
  'At least one field is required'
)

export const projectSupplySchema = z.object({
  supplyId: z.coerce.number().int().positive(),
  quantityUsed: z.coerce.number().finite().positive(),
  unit: optionalText(40),
  notes: optionalText(1000)
}).strict()

const httpUrl = z.string().trim().url().refine((value) => {
  const protocol = new URL(value).protocol
  return protocol === 'http:' || protocol === 'https:'
}, 'URL must use http or https')

const bookmarkFields = {
  url: httpUrl,
  title: optionalText(300),
  description: optionalText(1000),
  siteName: optionalText(200),
  favicon: httpUrl.nullish().optional(),
  ogImage: httpUrl.nullish().optional(),
  imagePath,
  tags: z.array(z.string().trim().min(1).max(50)).max(20),
  notes: optionalText(5000),
  favorite: z.boolean()
}

export const bookmarkCreateSchema = z.object({
  ...bookmarkFields,
  tags: bookmarkFields.tags.default([]),
  favorite: bookmarkFields.favorite.default(false)
}).strict()

export const bookmarkPatchSchema = z.object(bookmarkFields).partial().refine(
  value => Object.keys(value).length > 0,
  'At least one field is required'
)

export const bookmarkPreviewSchema = z.object({
  url: httpUrl
}).strict()
