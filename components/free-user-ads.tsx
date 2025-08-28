'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, X, Sparkles, Zap, Shield } from 'lucide-react'
import { useAppStore } from '@/store'

interface AdContent {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  cta: string
  color: string
}

const adContents: AdContent[] = [
  {
    id: 'upgrade-1',
    title: 'Unlock 10x More Tasks',
    description: 'Upgrade to Pro for 50 tasks/day instead of just 5',
    icon: Zap,
    cta: 'Upgrade Now',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'upgrade-2',
    title: 'Process Larger Files',
    description: 'Handle files up to 200MB instead of 20MB',
    icon: Shield,
    cta: 'Go Pro',
    color: 'from-green-500 to-blue-600'
  },
  {
    id: 'upgrade-3',
    title: 'Priority Processing',
    description: 'Your tasks get processed first in the queue',
    icon: Crown,
    cta: 'Get Priority',
    color: 'from-purple-500 to-pink-600'
  }
]

export function FreeUserAds() {
  const { currentPlan } = useAppStore()
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [dismissedAds, setDismissedAds] = useState<string[]>([])

  // Don't show ads for pro users
  if (currentPlan === 'pro') return null

  const currentAd = adContents[currentAdIndex]

  const handleDismiss = () => {
    setDismissedAds(prev => [...prev, currentAd.id])
    setIsVisible(false)
    
    // Show next ad after a delay
    setTimeout(() => {
      const nextIndex = (currentAdIndex + 1) % adContents.length
      setCurrentAdIndex(nextIndex)
      setIsVisible(true)
    }, 3000)
  }

  const handleUpgrade = () => {
    // TODO: Implement upgrade flow
    console.log('Upgrade to Pro clicked')
  }

  // Don't show if all ads have been dismissed
  if (dismissedAds.length >= adContents.length) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-40"
        >
          {/* Ad Header */}
          <div className={`bg-gradient-to-r ${currentAd.color} text-white p-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <currentAd.icon className="h-4 w-4" />
                <span className="text-sm font-medium">Pro Feature</span>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Ad Content */}
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 mb-1">
              {currentAd.title}
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              {currentAd.description}
            </p>
            
            {/* Upgrade Button */}
            <button
              onClick={handleUpgrade}
              className={`w-full bg-gradient-to-r ${currentAd.color} text-white py-2 px-4 rounded-md text-sm font-medium hover:shadow-md transition-all duration-200 transform hover:scale-105`}
            >
              {currentAd.cta}
            </button>
          </div>

          {/* Subtle branding */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
              <Sparkles className="h-3 w-3" />
              <span>Upgrade to remove ads</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
