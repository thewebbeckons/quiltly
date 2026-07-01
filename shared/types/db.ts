import type { bookmarks, projectSupplies, projects, supplies } from '~~/server/db/schema'

export type Supply = typeof supplies.$inferSelect
export type NewSupply = typeof supplies.$inferInsert

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export type ProjectSupply = typeof projectSupplies.$inferSelect
export type NewProjectSupply = typeof projectSupplies.$inferInsert

export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert
