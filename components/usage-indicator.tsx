'use client'

import { motion } from 'framer-motion'
import { useDailyUsage } from '@/lib/hooks/useDailyUsage'
import { Crown, AlertCircle, CheckCircle } from 'lucide-react'

export function UsageIndicator() {
  const { 
    dailyUsage, 
    isLoading, 
    canProcessTask, 
    getRemainingTasks, 
    getUsagePercentage,
    planLimits 
  } = useDailyUsage()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <div className="w-4 h-4 bg-muted rounded-full animate-pulse"></div>
        <span>Loading usage...</span>
      </div>
    )
  }

  // Don't show for pro users with unlimited tasks
  if (planLimits.maxDailyTasks === -1) {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-600">
        <Crown className="h-4 w-4" />
        <span>Unlimited tasks</span>
      </div>
    )
  }

  const remainingTasks = getRemainingTasks()
  const usagePercentage = getUsagePercentage()
  const isNearLimit = usagePercentage >= 80
  const isAtLimit = usagePercentage >= 100

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2 text-sm"
    >
      {isAtLimit ? (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-600 font-medium">Daily limit reached</span>
        </>
      ) : isNearLimit ? (
        <>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <span className="text-yellow-600">
            {remainingTasks} task{remainingTasks !== 1 ? 's' : ''} remaining
          </span>
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-green-600">
            {remainingTasks} task{remainingTasks !== 1 ? 's' : ''} remaining
          </span>
        </>
      )}
      
      {/* Progress bar */}
      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isAtLimit ? 'bg-red-500' : 
            isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${usagePercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <span className="text-xs text-muted-foreground">
        {dailyUsage.taskCount}/{planLimits.maxDailyTasks}
      </span>
    </motion.div>
  )
}
