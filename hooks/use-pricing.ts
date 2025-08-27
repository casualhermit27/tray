import { useState, useCallback } from 'react'
import { getToolLimits, PlanType } from '@/lib/pricing/feature-limits'

export interface PricingState {
  currentPlan: PlanType
  isUpgradePromptOpen: boolean
  upgradeTriggers: string[]
  currentTool: string | null
}

export function usePricing() {
  const [pricingState, setPricingState] = useState<PricingState>({
    currentPlan: 'free',
    isUpgradePromptOpen: false,
    upgradeTriggers: [],
    currentTool: null
  })

  const checkToolAccess = useCallback((toolId: string, fileSize: number, fileCount: number, pageCount?: number) => {
    const limits = getToolLimits(toolId)
    if (!limits) return { canAccess: false, reason: 'Tool not available' }

    const planLimits = limits[pricingState.currentPlan as 'free' | 'pro']
    if (!planLimits) return { canAccess: false, reason: 'Plan not supported' }

    // Check file size
    if (fileSize > planLimits.maxFileSize) {
      return {
        canAccess: false,
        reason: 'File size exceeds limit',
        upgradeTriggers: [`File size limit: ${Math.round(fileSize / (1024 * 1024))}MB exceeds ${Math.round(planLimits.maxFileSize / (1024 * 1024))}MB limit`]
      }
    }

    // Check file count
    if (fileCount > planLimits.maxFilesPerTask) {
      return {
        canAccess: false,
        reason: 'File count exceeds limit',
        upgradeTriggers: [`Batch processing: ${fileCount} files exceeds ${planLimits.maxFilesPerTask} file limit`]
      }
    }

    // Check page count
    if (pageCount && planLimits.maxPagesPerTask && pageCount > planLimits.maxPagesPerTask) {
      return {
        canAccess: false,
        reason: 'Page count exceeds limit',
        upgradeTriggers: [`Page limit: ${pageCount} pages exceeds ${planLimits.maxPagesPerTask} page limit`]
      }
    }

    return { canAccess: true }
  }, [pricingState.currentPlan])

  const showUpgradePrompt = useCallback((toolId: string, triggers: string[]) => {
    setPricingState(prev => ({
      ...prev,
      isUpgradePromptOpen: true,
      upgradeTriggers: triggers,
      currentTool: toolId
    }))
  }, [])

  const hideUpgradePrompt = useCallback(() => {
    setPricingState(prev => ({
      ...prev,
      isUpgradePromptOpen: false,
      upgradeTriggers: [],
      currentTool: null
    }))
  }, [])

  const upgradeToPro = useCallback(() => {
    // TODO: Implement Stripe checkout
    console.log('Redirecting to Stripe checkout...')
    hideUpgradePrompt()
  }, [hideUpgradePrompt])

  const getToolLimitsData = useCallback((toolId: string) => {
    return getToolLimits(toolId)
  }, [])

  const getUpgradeTriggers = useCallback((toolId: string) => {
    if (pricingState.currentPlan === 'pro') return []
    
    const limits = getToolLimits(toolId)
    if (!limits) return []
    
    const freeLimits = limits.free
    const proLimits = limits.pro
    
    const triggers: string[] = []
    
    if (freeLimits.maxFileSize < proLimits.maxFileSize) {
      triggers.push(`File size limit: ${Math.round(freeLimits.maxFileSize / (1024 * 1024))}MB → ${Math.round(proLimits.maxFileSize / (1024 * 1024))}MB`)
    }
    
    if (freeLimits.maxFilesPerTask < proLimits.maxFilesPerTask) {
      triggers.push(`Batch processing: ${freeLimits.maxFilesPerTask} file → ${proLimits.maxFilesPerTask} files`)
    }
    
    if (freeLimits.maxTasksPerHour !== -1) {
      triggers.push(`Hourly limit: ${freeLimits.maxTasksPerHour} tasks → Unlimited`)
    }
    
    if (!freeLimits.advancedFeatures && proLimits.advancedFeatures) {
      triggers.push('Advanced features unlocked')
    }
    
    if (freeLimits.watermark && !proLimits.watermark) {
      triggers.push('No watermarks')
    }
    
    return triggers
  }, [pricingState.currentPlan])

  return {
    ...pricingState,
    checkToolAccess,
    showUpgradePrompt,
    hideUpgradePrompt,
    upgradeToPro,
    getToolLimits: getToolLimitsData,
    getUpgradeTriggers
  }
}
