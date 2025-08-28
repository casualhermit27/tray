export interface Tray {
  id: string
  name: string
  description: string
  icon: string
  color: string
  tools: Tool[]
}

export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  trayId: string
  planRequired?: 'free' | 'pro' // Which plan is required to access this tool
  options?: ToolOption[]
  keywords?: string[]
  seoDescription?: string
}

export interface ToolOption {
  id: string
  name: string
  type: 'select' | 'slider' | 'toggle' | 'input'
  defaultValue: any
  options?: string[]
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

// Plan-related types
export type PlanType = 'free' | 'pro'

export interface PlanFeature {
  id: string
  name: string
  description: string
  included: boolean
  limit?: string | number
}

export interface Plan {
  id: PlanType
  name: string
  price: number
  period: 'month' | 'year'
  description: string
  features: PlanFeature[]
  popular?: boolean
  cta: string
}

export interface PlanLimits {
  maxFileSize: number // in bytes
  maxFilesAtOnce: number
  maxDailyTasks: number
  maxPagesPerFile: number // Maximum pages per file (for PDFs)
  watermark: boolean
  ads: boolean
  priorityQueue: boolean
  ocrSupport: boolean
  apiAccess: boolean
  teamMembers?: number
  whiteLabel: boolean
  
  // New features
  cloudIntegrations: boolean // Google Drive, Dropbox, OneDrive
  fileRetention: number // Days files are kept (0 = immediate deletion)
  multiLanguageOCR: boolean // Multiple language support
  fileHistory: number // Number of recent files to keep
  versioning: boolean // Save multiple versions
  prioritySupport: boolean // Email/ticket support
  teamWorkspace: boolean // Shared team folders
  adminDashboard: boolean // Usage analytics + member management
  advancedOCR: boolean // 50+ languages + handwriting
  dataResidency: boolean // Choose storage location
  sla: boolean // 99.9% uptime guarantee
  customBranding: boolean // Your logo on files
  extendedRetention: number // Extended storage days
  singleSignOn: boolean // SSO integration
  webhookEvents: boolean // API automation triggers
}

export interface UserPlan {
  type: PlanType
  limits: PlanLimits
  features: PlanFeature[]
}

export interface ProcessingJob {
  id: string
  toolId: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  file?: File
  result?: ProcessingResult
  processingResult?: any // Store the actual processing service result for downloads
  createdAt: Date
  completedAt?: Date
}

export interface ProcessingResult {
  downloadUrl?: string
  previewUrl?: string
  text?: string
  metadata?: Record<string, any>
  error?: string
}

export interface FileUpload {
  id: string
  file: File
  preview?: string
  size: number
  type: string
  uploadedAt: Date
}
