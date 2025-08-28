'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface OnboardingStep {
  title: string
  description: string
  icon: string
  color: string
  features: string[]
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Welcome to Trayyy',
    description: 'Simple file processing tools organized into intuitive trays',
    icon: '🎯',
    color: 'blue',
    features: ['Clean, minimal interface', 'One action per screen', 'Instant results']
  },
  {
    title: 'Documents Tray',
    description: 'Handle PDFs, Word docs, and text files',
    icon: '📂',
    color: 'blue',
    features: ['Merge multiple PDFs', 'Compress large files', 'Extract specific pages']
  },
  {
    title: 'Data Tray',
    description: 'Convert and format data files',
    icon: '📊',
    color: 'green',
    features: ['Excel ↔ CSV conversion', 'JSON formatting', 'Data cleaning tools']
  },
  {
    title: 'Media Tray',
    description: 'Process images and media files',
    icon: '🎨',
    color: 'purple',
    features: ['Image compression', 'Format conversion', 'OCR text extraction']
  },
  {
    title: 'Web Tray',
    description: 'Web development and content tools',
    icon: '🌐',
    color: 'orange',
    features: ['HTML to Markdown', 'Text extraction', 'Website screenshots']
  }
]

interface OnboardingProps {
  isOpen: boolean
  onClose: () => void
}

export default function Onboarding({ isOpen, onClose }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipOnboarding = () => {
    localStorage.setItem('onboarding-completed', 'true')
    onClose()
  }

  const completeOnboarding = () => {
    localStorage.setItem('onboarding-completed', 'true')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{onboardingSteps[currentStep].icon}</span>
              <h2 className="text-xl font-heading font-semibold text-foreground">
                {onboardingSteps[currentStep].title}
              </h2>
            </div>
            <button
              onClick={skipOnboarding}
              className="p-2 hover:bg-accent rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="mb-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {onboardingSteps[currentStep].description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {onboardingSteps[currentStep].features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-center space-x-2 text-sm text-foreground"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Progress */}
              <div className="flex justify-center space-x-2 mb-6">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-foreground'
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep < onboardingSteps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="btn-ghost"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={completeOnboarding}
                  className="btn-ghost bg-foreground text-background hover:bg-foreground/90"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
