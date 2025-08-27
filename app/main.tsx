'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store'
import LandingPage from '@/components/landing-page'
import Dashboard from './dashboard/page'
import ToolPage from './tool/page'
import ToolShowcase from '@/components/tool-showcase'
import Onboarding from '@/components/onboarding'
import ProcessingHistory from '@/components/processing-history'
import Navigation from '@/components/navigation'
import PlanToggle from '@/components/plan-toggle'
import { handleToolDownload } from '@/lib/download-utils'

export default function MainApp() {
  const { currentView, jobs, setView } = useAppStore()
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Check if onboarding has been completed
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboarding-completed')
    if (!onboardingCompleted) {
      setShowOnboarding(true)
    }
  }, [])

  const handleUndo = (jobId: string) => {
    // Remove the job from history
    useAppStore.getState().removeJob(jobId)
  }

  const handleDownload = (jobId: string, customFilename?: string) => {
    const job = jobs.find(j => j.id === jobId)
    if (job && job.file) {
      try {
        // Use processing result if available, otherwise fall back to job result
        const processingResult = job.processingResult || job.result
        if (processingResult) {
          handleToolDownload(job.toolId, processingResult, job.file.name, customFilename)
        } else {
          console.error('No processing result available for download')
        }
      } catch (error) {
        console.error('Download failed:', error)
      }
    }
  }

  const handleDelete = (jobId: string) => {
    useAppStore.getState().removeJob(jobId)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />
      case 'dashboard':
        return <Dashboard />
      case 'tool':
        return <ToolPage />
      case 'tool-showcase':
        return <ToolShowcase />
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Processing History */}
      <ProcessingHistory
        jobs={jobs}
        onUndo={handleUndo}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      {/* Onboarding Modal */}
      <Onboarding
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Plan Toggle for Testing */}
      <PlanToggle />
    </div>
  )
}
