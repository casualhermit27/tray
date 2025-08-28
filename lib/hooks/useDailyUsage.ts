import { useState, useEffect } from 'react'
import { useAppStore } from '@/store'
import { PLAN_LIMITS } from '@/lib/plans'

interface DailyUsage {
  date: string
  taskCount: number
}

export function useDailyUsage() {
  const { currentPlan } = useAppStore()
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>({ date: '', taskCount: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]
  const planLimits = PLAN_LIMITS[currentPlan]

  useEffect(() => {
    // Load daily usage from localStorage
    const loadDailyUsage = () => {
      try {
        const stored = localStorage.getItem('trayyy-daily-usage')
        if (stored) {
          const usage: DailyUsage = JSON.parse(stored)
          
          // Reset if it's a new day
          if (usage.date !== today) {
            const newUsage: DailyUsage = { date: today, taskCount: 0 }
            localStorage.setItem('trayyy-daily-usage', JSON.stringify(newUsage))
            setDailyUsage(newUsage)
          } else {
            setDailyUsage(usage)
          }
        } else {
          // Initialize for today
          const newUsage: DailyUsage = { date: today, taskCount: 0 }
          localStorage.setItem('trayyy-daily-usage', JSON.stringify(newUsage))
          setDailyUsage(newUsage)
        }
      } catch (error) {
        console.error('Error loading daily usage:', error)
        // Initialize for today on error
        const newUsage: DailyUsage = { date: today, taskCount: 0 }
        localStorage.setItem('trayyy-daily-usage', JSON.stringify(newUsage))
        setDailyUsage(newUsage)
      }
      setIsLoading(false)
    }

    loadDailyUsage()
  }, [today])

  const incrementTaskCount = () => {
    const newUsage: DailyUsage = { 
      date: today, 
      taskCount: dailyUsage.taskCount + 1 
    }
    localStorage.setItem('trayyy-daily-usage', JSON.stringify(newUsage))
    setDailyUsage(newUsage)
  }

  const canProcessTask = (): boolean => {
    if (planLimits.maxDailyTasks === -1) return true // Unlimited
    return dailyUsage.taskCount < planLimits.maxDailyTasks
  }

  const getRemainingTasks = (): number => {
    if (planLimits.maxDailyTasks === -1) return -1 // Unlimited
    return Math.max(0, planLimits.maxDailyTasks - dailyUsage.taskCount)
  }

  const getUsagePercentage = (): number => {
    if (planLimits.maxDailyTasks === -1) return 0 // Unlimited
    return Math.round((dailyUsage.taskCount / planLimits.maxDailyTasks) * 100)
  }

  const resetDailyUsage = () => {
    const newUsage: DailyUsage = { date: today, taskCount: 0 }
    localStorage.setItem('trayyy-daily-usage', JSON.stringify(newUsage))
    setDailyUsage(newUsage)
  }

  return {
    dailyUsage,
    isLoading,
    canProcessTask,
    getRemainingTasks,
    getUsagePercentage,
    incrementTaskCount,
    resetDailyUsage,
    planLimits
  }
}
