'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Crown, Zap, Users, HelpCircle, Lock } from 'lucide-react'
import Link from 'next/link'
import { useAppStore, usePlanStore } from '@/store'
import { generateId, formatFileSize, formatDuration } from '@/lib/utils'
import { ProcessingJob, FileUpload, ToolOption, Tool } from '@/types'
import { processFile } from '@/lib/processing'
import { handleToolDownload } from '@/lib/download-utils'
import { useSession } from 'next-auth/react'
import { UsageTracker } from '@/lib/usage-tracker'
import { PLANS } from '@/lib/plans'
import { getSEODataByToolId, generateFAQSchema, generateToolSchema } from '@/data/seo-data'
import FileUploadZone from '@/components/file-upload-zone'
import ToolOptions from '@/components/tool-options'
import EnhancedToolOptions from '@/components/enhanced-tool-options'
import ActionButtons from '@/components/action-buttons'
import ResultsPanel from '@/components/results-panel'

interface ToolPageProps {
  tool: Tool
}

export default function ToolPage({ tool }: ToolPageProps) {
  const { data: session } = useSession()
  const { currentTrayId, currentToolId, setView, addJob, addUpload, updateJob, removeJob } = useAppStore()
  const { currentPlan, planLimits, canProcessFile, hasFeature } = usePlanStore()
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentJob, setCurrentJob] = useState<ProcessingJob | null>(null)
  const [toolOptions, setToolOptions] = useState<Record<string, any>>({})
  const [urlInput, setUrlInput] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [planError, setPlanError] = useState<string | null>(null)

  const tray = tool ? { id: tool.trayId || 'general', name: tool.trayId || 'General' } : null
  const seoData = tool ? getSEODataByToolId(tool.id) : null

  // Initialize tool options with default values
  useEffect(() => {
    if (tool?.options) {
      const options: Record<string, any> = {}
      tool.options.forEach((option: ToolOption) => {
        options[option.id] = option.defaultValue
      })
      setToolOptions(options)
    }
  }, [tool?.id])

  // Plan hierarchy for determining access
  const planHierarchy = { free: 0, pro: 1 }

  // Check if user can access this tool
  if (tool.planRequired && planHierarchy[currentPlan] < planHierarchy[tool.planRequired]) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="mb-6">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {tool.name} Requires {tool.planRequired === 'pro' ? 'Pro Plan' : 'Pro Plan'}
            </h1>
            <p className="text-muted-foreground">
              Upgrade to Pro to access this advanced tool and unlock unlimited processing power.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Upgrade to unlock:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {tool.planRequired === 'pro' && (
                  <>
                    <li>• Up to 100MB files</li>
                    <li>• Process up to 10 files at once</li>
                    <li>• No watermarks or ads</li>
                    <li>• OCR and AI features</li>
                    <li>• Team collaboration</li>
                    <li>• API access</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <Link href="/pricing" className="btn-primary w-full">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="btn-ghost btn-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{tray?.name}</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium text-foreground">{tool.name}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {session && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentPlan === 'pro' 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    {currentPlan === 'pro' ? 'Pro' : 'Free'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload and Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tool Header */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
                  {tool.name}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl lg:max-w-none">
                  {tool.description}
                </p>
              </div>

              {/* File Upload Zone */}
              <FileUploadZone
                onFileUpload={(uploads) => {
                  if (Array.isArray(uploads)) {
                    setUploadedFiles(uploads)
                  } else {
                    setUploadedFiles([uploads])
                  }
                }}
                acceptedFileTypes={{ '*': ['*'] }}
                maxFiles={planLimits.maxFilesAtOnce}
                toolId={tool.id}
              />

              {/* Tool Options */}
              {tool.options && tool.options.length > 0 && (
                <EnhancedToolOptions
                  toolId={tool.id}
                  options={tool.options}
                  files={uploadedFiles}
                  onOptionsChange={setToolOptions}
                />
              )}

              {/* Action Buttons */}
              <ActionButtons
                hasFile={uploadedFiles.length > 0}
                isProcessing={isProcessing}
                hasResult={false}
                onUpload={() => {
                  // Upload logic handled by FileUploadZone
                }}
                onProcess={async () => {
                  // Process files logic here
                  console.log('Processing files:', uploadedFiles, toolOptions)
                }}
                onDownload={() => {
                  // Download logic here
                }}
              />
            </div>

            {/* Right Column - Results and History */}
            <div className="space-y-6">
              {/* Results Panel */}
              {currentJob && (
                <div className="card">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                    Processing Results
                  </h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Job ID: {currentJob.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {currentJob.status}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Progress: {currentJob.progress}%
                    </p>
                  </div>
                </div>
              )}

              {/* Processing History */}
              <div className="card">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Recent Processing
                </h3>
                <div className="space-y-3">
                  {/* Add processing history here */}
                  <p className="text-sm text-muted-foreground">
                    No recent processing history
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
