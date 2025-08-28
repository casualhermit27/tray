import { Plan, PlanLimits, PlanType } from '@/types'

export type { PlanType } from '@/types'

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    period: 'month',
    description: 'Perfect for light users and occasional conversions',
    features: [
      'Access to all tools (PDF, Data, Media, Web, Security, E-Sign, Advanced)',
      '5 tasks per day',
      '20 MB max file size',
      'All tools available',
      'Files deleted instantly after processing',
      'No file storage'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    price: 4.99,
    period: 'month',
    description: 'For students, professionals, and businesses',
    features: [
      '50 tasks per day (practically unlimited)',
      '200 MB max file size',
      'All tools available (same as Free)',
      'Priority processing (Pro tasks queued first)',
      'No ads',
      'Files deleted after processing (no storage)'
    ],
    cta: 'Start Pro Trial',
    popular: true
  }
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxFileSize: 20 * 1024 * 1024, // 20 MB
    maxFilesAtOnce: 1,
    maxDailyTasks: 5, // 5 tasks per day
    maxPagesPerFile: 50, // Maximum 50 pages per file
    watermark: false, // No watermarks in new model
    ads: true, // Show ads for free users
    priorityQueue: false,
    ocrSupport: true, // OCR available in free plan
    apiAccess: false,
    whiteLabel: false,
    
    // New features
    cloudIntegrations: false, // No cloud uploads
    fileRetention: 0, // Instant deletion (0 days)
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
    maxFileSize: 200 * 1024 * 1024, // 200 MB
    maxFilesAtOnce: 10,
    maxDailyTasks: 50, // 50 tasks per day
    maxPagesPerFile: -1, // Unlimited pages
    watermark: false,
    ads: false, // No ads for pro users
    priorityQueue: true,
    ocrSupport: true,
    apiAccess: false,
    whiteLabel: false,
    
    // New features
    cloudIntegrations: true, // Google Drive, Dropbox, OneDrive
    fileRetention: 0, // Instant deletion (0 days) - privacy first
    multiLanguageOCR: true, // English + 10 major languages
    fileHistory: 0, // No file history - privacy first
    versioning: false, // No versioning - privacy first
    prioritySupport: true, // Email/ticket support
    teamWorkspace: false, // No team features
    adminDashboard: false, // No admin features
    advancedOCR: false, // Multi-language but not advanced
    dataResidency: false, // No choice of location
    sla: false, // No SLA guarantee
    customBranding: false, // No custom branding
    extendedRetention: 0, // No extended retention - privacy first
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
