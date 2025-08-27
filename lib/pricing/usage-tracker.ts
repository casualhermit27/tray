import { prisma } from '@/lib/prisma'
import { Redis } from '@upstash/redis'
import { 
  getFeatureLimits, 
  checkFileSizeLimit, 
  checkFileCountLimit, 
  checkPageLimit,
  PlanType 
} from './feature-limits'

// Initialize Redis for fast usage tracking
const redis = process.env.UPSTASH_REDIS_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

export interface UsageCheckResult {
  canProceed: boolean
  reason?: string
  upgradeTriggers: string[]
  currentUsage: number
  limit: number
  plan: PlanType
}

export interface UsageStats {
  userId: string
  toolId: string
  toolName: string
  fileSize: number
  fileCount: number
  pageCount?: number
  timestamp: Date
  plan: PlanType
}

export class PricingUsageTracker {
  // Check if user can use a specific tool
  static async checkToolUsage(
    userId: string,
    toolId: string,
    fileSize: number,
    fileCount: number,
    pageCount?: number
  ): Promise<UsageCheckResult> {
    try {
      // Get user's subscription plan
      const subscription = await prisma.subscription.findUnique({
        where: { userId }
      })
      
      const plan: PlanType = (subscription?.plan as PlanType) || 'free'
      const limits = getFeatureLimits(toolId, plan)
      
      if (!limits) {
        return {
          canProceed: false,
          reason: 'Tool not available',
          upgradeTriggers: [],
          currentUsage: 0,
          limit: 0,
          plan
        }
      }
      
      // Check file size limit
      if (!checkFileSizeLimit(toolId, plan, fileSize)) {
        const upgradeTriggers = [
          `File size limit: ${Math.round(fileSize / (1024 * 1024))}MB exceeds ${Math.round(limits.maxFileSize / (1024 * 1024))}MB limit`
        ]
        
        return {
          canProceed: false,
          reason: 'File size exceeds limit',
          upgradeTriggers,
          currentUsage: fileSize,
          limit: limits.maxFileSize,
          plan
        }
      }
      
      // Check file count limit
      if (!checkFileCountLimit(toolId, plan, fileCount)) {
        const upgradeTriggers = [
          `Batch processing: ${fileCount} files exceeds ${limits.maxFilesPerTask} file limit`
        ]
        
        return {
          canProceed: false,
          reason: 'File count exceeds limit',
          upgradeTriggers,
          currentUsage: fileCount,
          limit: limits.maxFilesPerTask,
          plan
        }
      }
      
      // Check page limit (for PDF tools)
      if (pageCount && !checkPageLimit(toolId, plan, pageCount)) {
        const upgradeTriggers = [
          `Page limit: ${pageCount} pages exceeds ${limits.maxPagesPerTask} page limit`
        ]
        
        return {
          canProceed: false,
          reason: 'Page count exceeds limit',
          upgradeTriggers,
          currentUsage: pageCount,
          limit: limits.maxPagesPerTask || 0,
          plan
        }
      }
      
      // Check hourly usage limit (for free plan)
      if (plan === 'free' && limits.maxTasksPerHour > 0) {
        const hourlyUsage = await this.getHourlyUsage(userId)
        
        if (hourlyUsage >= limits.maxTasksPerHour) {
          const upgradeTriggers = [
            `Hourly limit: ${limits.maxTasksPerHour} tasks per hour reached`,
            'Upgrade to Pro for unlimited processing'
          ]
          
          return {
            canProceed: false,
            reason: 'Hourly usage limit reached',
            upgradeTriggers,
            currentUsage: hourlyUsage,
            limit: limits.maxTasksPerHour,
            plan
          }
        }
      }
      
      // Get upgrade triggers for free users
      const upgradeTriggers = plan === 'free' ? this.getUpgradeTriggers(toolId) : []
      
      return {
        canProceed: true,
        upgradeTriggers,
        currentUsage: 0,
        limit: 0,
        plan
      }
      
    } catch (error) {
      console.error('Usage check error:', error)
      // Fail open - allow usage if we can't check
      return {
        canProceed: true,
        upgradeTriggers: [],
        currentUsage: 0,
        limit: 0,
        plan: 'free'
      }
    }
  }
  
  // Track usage after successful processing
  static async trackUsage(
    userId: string,
    toolId: string,
    toolName: string,
    fileSize: number,
    fileCount: number,
    pageCount?: number
  ): Promise<void> {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId }
      })
      
      const plan: PlanType = (subscription?.plan as PlanType) || 'free'
      
      // Track in Redis for fast access
      if (redis) {
        const hourlyKey = `usage:${userId}:hourly:${this.getCurrentHour()}`
        const dailyKey = `usage:${userId}:daily:${this.getCurrentDay()}`
        
        // Increment hourly usage
        await redis.incr(hourlyKey)
        await redis.expire(hourlyKey, 3600) // 1 hour TTL
        
        // Increment daily usage
        await redis.incr(dailyKey)
        await redis.expire(dailyKey, 86400) // 24 hours TTL
      }
      
      // Store detailed usage in database
      await prisma.usageStats.create({
        data: {
          userId,
          toolId,
          toolName,
          action: 'process',
          fileSize,
          date: this.getCurrentDay()
        }
      })
      
    } catch (error) {
      console.error('Usage tracking error:', error)
    }
  }
  
  // Get current hourly usage
  private static async getHourlyUsage(userId: string): Promise<number> {
    try {
      if (redis) {
        const hourlyKey = `usage:${userId}:hourly:${this.getCurrentHour()}`
        const usage = await redis.get(hourlyKey)
        return Number(usage) || 0
      }
      
      // Fallback to database query
      const startOfHour = new Date()
      startOfHour.setMinutes(0, 0, 0)
      
      const usage = await prisma.usageStats.count({
        where: {
          userId,
          timestamp: {
            gte: startOfHour
          }
        }
      })
      
      return usage
      
    } catch (error) {
      console.error('Hourly usage check error:', error)
      return 0
    }
  }
  
  // Get current daily usage
  static async getDailyUsage(userId: string): Promise<number> {
    try {
      if (redis) {
        const dailyKey = `usage:${userId}:daily:${this.getCurrentDay()}`
        const usage = await redis.get(dailyKey)
        return Number(usage) || 0
      }
      
      // Fallback to database query
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      
      const usage = await prisma.usageStats.count({
        where: {
          userId,
          timestamp: {
            gte: startOfDay
          }
        }
      })
      
      return usage
      
    } catch (error) {
      console.error('Daily usage check error:', error)
      return 0
    }
  }
  
  // Get monthly usage
  static async getMonthlyUsage(userId: string): Promise<number> {
    try {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      
      const usage = await prisma.usageStats.count({
        where: {
          userId,
          timestamp: {
            gte: startOfMonth
          }
        }
      })
      
      return usage
      
    } catch (error) {
      console.error('Monthly usage check error:', error)
      return 0
    }
  }
  
  // Get usage breakdown by tool
  static async getToolUsageBreakdown(userId: string, days: number = 30): Promise<Record<string, number>> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const usage = await prisma.usageStats.groupBy({
        by: ['toolId'],
        where: {
          userId,
          timestamp: {
            gte: startDate
          }
        },
        _count: {
          toolId: true
        }
      })
      
      const breakdown: Record<string, number> = {}
      usage.forEach(item => {
        breakdown[item.toolId] = item._count.toolId
      })
      
      return breakdown
      
    } catch (error) {
      console.error('Tool usage breakdown error:', error)
      return {}
    }
  }
  
  // Get upgrade triggers for a tool
  private static getUpgradeTriggers(toolId: string): string[] {
    const triggers: string[] = []
    
    // Add common upgrade triggers
    triggers.push('Remove hourly limits')
    triggers.push('Increase file size limits')
    triggers.push('Enable batch processing')
    triggers.push('Remove watermarks')
    triggers.push('Access advanced features')
    
    return triggers
  }
  
  // Helper methods for time-based keys
  private static getCurrentHour(): string {
    const now = new Date()
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}`
  }
  
  private static getCurrentDay(): string {
    const now = new Date()
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  }
  
  // Reset usage (for testing/admin purposes)
  static async resetUsage(userId: string): Promise<void> {
    try {
      if (redis) {
        const hourlyKey = `usage:${userId}:hourly:${this.getCurrentHour()}`
        const dailyKey = `usage:${userId}:daily:${this.getCurrentDay()}`
        
        await redis.del(hourlyKey)
        await redis.del(dailyKey)
      }
      
      // Note: Database usage stats are kept for analytics
      console.log(`Usage reset for user: ${userId}`)
      
    } catch (error) {
      console.error('Usage reset error:', error)
    }
  }
}
