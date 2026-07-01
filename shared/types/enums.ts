export type SupplyType = 'fabric' | 'thread' | 'batting' | 'notion' | 'tool' | 'pattern' | 'other'

export type ProjectStatus = 'planning' | 'in_progress' | 'paused' | 'completed' | 'archived'

export interface SupplyMetadata {
  fabric?: { width?: number, prewashed?: boolean, pattern?: string, content?: string }
  thread?: { weight?: string, fiber?: string, length?: string }
  batting?: { size?: string, loft?: string, fiber?: string }
  notion?: { brand?: string }
  tool?: { brand?: string, size?: string }
  pattern?: { designer?: string, type?: string }
  other?: Record<string, string | number | boolean | null>
}

export const SUPPLY_TYPES: SupplyType[] = ['fabric', 'thread', 'batting', 'notion', 'tool', 'pattern', 'other']
export const PROJECT_STATUSES: ProjectStatus[] = ['planning', 'in_progress', 'paused', 'completed', 'archived']
