import { Plan, PlanLimits, PlanType } from '@/types'

export type { PlanType } from '@/types'

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      'Access to all core tools',
      '3 operations per hour',
      '10 MB max file size',
      'Single file processing',
      'Watermarked outputs'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    price: 399,
    period: 'month',
    description: 'For power users and professionals',
    features: [
      'Unlimited operations',
      '100 MB max file size',
      'Batch processing (up to 10 files)',
      'Priority queue processing',
      'No watermarks',
      'Advanced features unlocked',
      'OCR and AI features',
      'Team collaboration',
      'API access'
    ],
    cta: 'Start Pro Trial',
    popular: true
  }
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    maxFilesAtOnce: 2,
    maxDailyTasks: 5,
    maxPagesPerFile: 10, // Maximum 10 pages per file
    watermark: true,
    ads: true,
    priorityQueue: false,
    ocrSupport: false,
    aiAssist: false,
    apiAccess: false,
    whiteLabel: false,
    
    // New features
    cloudIntegrations: false, // No cloud uploads
    fileRetention: 0.5, // 30 minutes (0.5 days)
    multiLanguageOCR: false, // English only
    fileHistory: 0, // No file history
    versioning: false, // No versioning
    prioritySupport: false, // Community support only
    teamWorkspace: false, // No team features
    adminDashboard: false, // No admin features
    advancedOCR: false, // Basic OCR only
    dataResidency: false, // No choice of location
    sla: false, // No SLA guarantee
    customBranding: false, // No custom branding
    extendedRetention: 0, // No extended retention
    singleSignOn: false, // No SSO
    webhookEvents: false // No webhooks
  },
  pro: {
    maxFileSize: 100 * 1024 * 1024, // 100 MB
    maxFilesAtOnce: 20,
    maxDailyTasks: -1, // Unlimited
    maxPagesPerFile: 100, // Maximum 100 pages per file
    watermark: false,
    ads: false,
    priorityQueue: true,
    ocrSupport: true,
    aiAssist: true,
    apiAccess: false,
    whiteLabel: false,
    
    // New features
    cloudIntegrations: true, // Google Drive, Dropbox, OneDrive
    fileRetention: 7, // 7 days
    multiLanguageOCR: true, // English + 10 major languages
    fileHistory: 20, // Last 20 processed files
    versioning: true, // Save multiple versions
    prioritySupport: true, // Email/ticket support
    teamWorkspace: false, // No team features
    adminDashboard: false, // No admin features
    advancedOCR: false, // Multi-language but not advanced
    dataResidency: false, // No choice of location
    sla: false, // No SLA guarantee
    customBranding: false, // No custom branding
    extendedRetention: 0, // No extended retention
    singleSignOn: false, // No SSO
    webhookEvents: false // No webhooks
  }
}

export function getPlanLimits(planType: PlanType): PlanLimits {
  return PLAN_LIMITS[planType]
}

export function canProcessFile(planType: PlanType, fileSize: number, currentFileCount: number): boolean {
  const limits = getPlanLimits(planType)
  
  // Check file size limit
  if (limits.maxFileSize !== -1 && fileSize > limits.maxFileSize) {
    return false
  }
  
  // Check file count limit
  if (limits.maxFilesAtOnce !== -1 && currentFileCount >= limits.maxFilesAtOnce) {
    return false
  }
  
  return true
}

export function shouldShowWatermark(planType: PlanType): boolean {
  return PLAN_LIMITS[planType].watermark
}

export function shouldShowAds(planType: PlanType): boolean {
  return PLAN_LIMITS[planType].ads
}

export function hasFeature(planType: PlanType, feature: keyof typeof PLAN_LIMITS.free): boolean {
  const limits = getPlanLimits(planType)
  return limits[feature] === true || (typeof limits[feature] === 'number' && limits[feature] > 0)
}

// New helper functions for additional features
export function canProcessPages(planType: PlanType, pageCount: number): boolean {
  const limits = getPlanLimits(planType)
  return limits.maxPagesPerFile === -1 || pageCount <= limits.maxPagesPerFile
}

export function getFileRetentionDays(planType: PlanType): number {
  const limits = getPlanLimits(planType)
  return limits.fileRetention
}

export function hasCloudIntegrations(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.cloudIntegrations
}

export function getFileHistoryLimit(planType: PlanType): number {
  const limits = getPlanLimits(planType)
  return limits.fileHistory
}

export function hasVersioning(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.versioning
}

export function hasPrioritySupport(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.prioritySupport
}

export function hasTeamWorkspace(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.teamWorkspace
}

export function hasAdminDashboard(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.adminDashboard
}

export function hasAdvancedOCR(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.advancedOCR
}

export function hasDataResidency(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.dataResidency
}

export function hasSLA(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.sla
}

export function hasCustomBranding(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.customBranding
}

export function hasExtendedRetention(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.extendedRetention > 0
}

export function hasSingleSignOn(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.singleSignOn
}

export function hasWebhookEvents(planType: PlanType): boolean {
  const limits = getPlanLimits(planType)
  return limits.webhookEvents
}
