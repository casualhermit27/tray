import { prisma } from './prisma'
import { Redis } from '@upstash/redis'

// Initialize Redis for fast usage tracking (optional for development)
const redis = process.env.UPSTASH_REDIS_REDIS_REST_URL && process.env.UPSTASH_REDIS_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REDIS_REST_TOKEN,
    })
  : null

export interface UsageLimits {
  free: number
  pro: number
  team: number
}

export const USAGE_LIMITS: UsageLimits = {
  free: 5,    // 5 conversions per day
  pro: 1000,  // 1000 conversions per day
  team: 5000  // 5000 conversions per day
}

export class UsageTracker {
  static async trackUsage(userId: string, toolId: string, toolName: string, action: string, fileSize?: number) {
    try {
      // Get user's subscription plan
      const subscription = await prisma.subscription.findUnique({
        where: { userId }
      })
      
      const plan = subscription?.plan || 'free'
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      
      // Track in Redis for fast access (if available)
      let currentUsage = 1
      if (redis) {
        const redisKey = `usage:${userId}:${today}`
        currentUsage = await redis.incr(redisKey)
        
        // Set expiry for end of day
        const now = new Date()
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        const secondsUntilEndOfDay = Math.floor((endOfDay.getTime() - now.getTime()) / 1000)
        await redis.expire(redisKey, secondsUntilEndOfDay)
      }
      
      // Store detailed usage in database
      await prisma.usageStats.create({
        data: {
          userId,
          toolId,
          toolName,
          action,
          fileSize,
          date: today
        }
      })
      
      return {
        success: true,
        currentUsage,
        limit: USAGE_LIMITS[plan as keyof UsageLimits],
        plan
      }
    } catch (error) {
      console.error('Usage tracking error:', error)
      return { success: false, error: 'Failed to track usage' }
    }
  }
  
  static async checkUsageLimit(userId: string): Promise<{ canProceed: boolean; currentUsage: number; limit: number; plan: string }> {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId }
      })
      
      const plan = subscription?.plan || 'free'
      const today = new Date().toISOString().split('T')[0]
      const redisKey = `usage:${userId}:${today}`
      
      const currentUsage = redis ? Number(await redis.get(redisKey) || 0) : 0
      const limit = USAGE_LIMITS[plan as keyof UsageLimits]
      
      return {
        canProceed: currentUsage < limit,
        currentUsage,
        limit,
        plan
      }
    } catch (error) {
      console.error('Usage limit check error:', error)
      // Fail open - allow usage if we can't check
      return { canProceed: true, currentUsage: 0, limit: 5, plan: 'free' }
    }
  }
  
  static async getUserStats(userId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId }
      })
      
      const today = new Date().toISOString().split('T')[0]
      const redisKey = `usage:${userId}:${today}`
      const todayUsage = redis ? Number(await redis.get(redisKey) || 0) : 0
      
      // Get monthly usage
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      const monthlyUsage = await prisma.usageStats.count({
        where: {
          userId,
          timestamp: {
            gte: startOfMonth
          }
        }
      })
      
      return {
        plan: subscription?.plan || 'free',
        todayUsage: todayUsage as number,
        monthlyUsage,
        limit: USAGE_LIMITS[subscription?.plan as keyof UsageLimits] || USAGE_LIMITS.free
      }
    } catch (error) {
      console.error('User stats error:', error)
      return {
        plan: 'free',
        todayUsage: 0,
        monthlyUsage: 0,
        limit: USAGE_LIMITS.free
      }
    }
  }
}
