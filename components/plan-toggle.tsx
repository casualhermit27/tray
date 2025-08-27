'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Settings, X } from 'lucide-react'
import { usePlanStore } from '@/store'
import { PLANS, PlanType } from '@/lib/plans'

export default function PlanToggle() {
  const { currentPlan, setCurrentPlan } = usePlanStore()
  const [isOpen, setIsOpen] = useState(false)

  const handlePlanChange = (planType: PlanType) => {
    setCurrentPlan(planType)
    setIsOpen(false)
  }

  const getPlanIcon = (planType: PlanType) => {
    switch (planType) {
      case 'pro': return <Crown className="h-4 w-4 text-yellow-500" />
      default: return <Crown className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPlanColor = (planType: PlanType) => {
    switch (planType) {
      case 'pro': return 'border-yellow-500/20 bg-yellow-500/10'
      default: return 'border-muted-foreground/20 bg-muted-foreground/10'
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full border-2 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 ${
          getPlanColor(currentPlan)
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Test Plan Switching"
      >
        <Settings className="h-5 w-5 text-foreground" />
      </motion.button>

      {/* Plan Selection Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 right-6 z-50 w-80 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-xl"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Test Plan Switching</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Switch between plans to test features and restrictions
              </p>

              <div className="space-y-2">
                {Object.values(PLANS).map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handlePlanChange(plan.id as PlanType)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      currentPlan === plan.id
                        ? 'border-foreground bg-foreground/5'
                        : 'border-border hover:border-foreground/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getPlanIcon(plan.id as PlanType)}
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{plan.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {plan.price === 0 ? 'Free' : `$${plan.price}/${plan.period}`}
                        </div>
                      </div>
                      {currentPlan === plan.id && (
                        <div className="w-2 h-2 bg-foreground rounded-full" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground">
                  <strong>Current Plan:</strong> {PLANS[currentPlan].name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  File size: {currentPlan === 'free' ? '10 MB' : '100 MB'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Max files: {currentPlan === 'free' ? '2' : '20'}
                </div>
                
                {/* Power Features Status */}
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="text-xs font-medium text-foreground mb-2">Power Features:</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>E-Signature</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        currentPlan === 'free' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {currentPlan === 'free' ? 'PRO+' : '✓'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>PDF Security</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        currentPlan === 'free' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {currentPlan === 'free' ? 'PRO+' : '✓'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Advanced Bulk</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        currentPlan === 'pro' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {currentPlan === 'pro' ? '✓' : 'PRO+'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
