'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Zap, Shield, CheckCircle } from 'lucide-react'


interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  upgradeTriggers: string[]
  currentPlan: 'free' | 'pro'
  toolName: string
}

export function UpgradePrompt({
  isOpen,
  onClose,
  upgradeTriggers,
  currentPlan,
  toolName
}: UpgradePromptProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    // TODO: Implement Stripe checkout
    console.log('Redirecting to Stripe checkout...')
    setIsUpgrading(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative border-0 bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-lg p-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Unlock Pro Features
              </h2>
              <p className="text-gray-600">
                Upgrade to Pro and remove all limits for {toolName}
              </p>
            </div>

            <div className="space-y-6">
              {/* Upgrade triggers */}
              {upgradeTriggers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Why upgrade?</h4>
                  <div className="space-y-2">
                    {upgradeTriggers.map((trigger, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{trigger}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Pro Plan includes:</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 rounded-lg bg-blue-50 p-3">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Unlimited Processing</div>
                      <div className="text-sm text-blue-700">No hourly limits</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 rounded-lg bg-green-50 p-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Larger Files</div>
                      <div className="text-sm text-green-700">Up to 100MB per file</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 rounded-lg bg-purple-50 p-3">
                    <Crown className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-900">Batch Processing</div>
                      <div className="text-sm text-purple-700">Process multiple files at once</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">₹399/month</div>
                  <div className="text-sm opacity-90">or ₹3,999/year (save 17%)</div>
                  <div className="mt-2 text-xs opacity-75">Cancel anytime</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all"
              >
                {isUpgrading ? 'Processing...' : 'Upgrade to Pro'}
              </button>
              
              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all py-3"
              >
                Maybe Later
              </button>
              </div>

              {/* Trust indicators */}
              <div className="text-center text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-4">
                  <span>🔒 Secure payment</span>
                  <span>💳 No hidden fees</span>
                  <span>🔄 30-day guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
