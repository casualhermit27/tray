'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Crown, Zap, Users, HelpCircle, Lock } from 'lucide-react'
import Link from 'next/link'
import { useAppStore, usePlanStore } from '@/store'
import { getTrayById, getToolById } from '@/data/trays'
import { generateId, formatFileSize, formatDuration } from '@/lib/utils'
import { ProcessingJob, FileUpload, ToolOption } from '@/types'
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

export default function ToolPage() {
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

  const tray = currentTrayId ? getTrayById(currentTrayId) : null
  const tool = currentToolId && currentTrayId ? getToolById(currentTrayId, currentToolId) : null
  const seoData = tool ? getSEODataByToolId(tool.id) : null

  // Initialize tool options with default values - MUST be before any conditional returns
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

  // Check if tool and tray exist
  if (!tool || !tray) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-semibold text-foreground mb-4">
            Tool not found
          </h1>
          <button
            onClick={() => setView('dashboard')}
            className="btn-ghost"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

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
                    <li>• OCR text extraction</li>
                    <li>• Team collaboration</li>
                    <li>• API access</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="btn-ghost bg-foreground text-background hover:bg-foreground/90"
            >
              View Plans
            </Link>
            <button
              onClick={() => setView('dashboard')}
              className="btn-ghost"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleFileUpload = (upload: FileUpload | FileUpload[]) => {
    if (Array.isArray(upload)) {
      // Check plan limits for multiple files
      if (!canProcessFile(0, upload.length)) {
        setPlanError(`Your ${PLANS[currentPlan].name} plan allows maximum ${planLimits.maxFilesAtOnce} files at once. Please upgrade to process more files.`)
        return
      }
      
      // Check individual file sizes
      for (const fileUpload of upload) {
        if (!canProcessFile(fileUpload.size, 1)) {
          setPlanError(`File "${fileUpload.file.name}" exceeds your plan's file size limit of ${formatFileSize(planLimits.maxFileSize)}. Please upgrade to process larger files.`)
          return
        }
      }
      
      upload.forEach(fileUpload => addUpload(fileUpload))
      setUploadedFiles(upload)
      setPlanError(null)
    } else {
      // Single file
      if (!canProcessFile(upload.size, 1)) {
        setPlanError(`File "${upload.file.name}" exceeds your plan's file size limit of ${formatFileSize(planLimits.maxFileSize)}. Please upgrade to process larger files.`)
        return
      }
      
      addUpload(upload)
      setUploadedFiles([upload])
      setPlanError(null)
    }
  }

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return
    
    // Create a fake file with the URL as content for web tools
    const urlBlob = new Blob([urlInput], { type: 'text/plain' })
    const urlFile = new File([urlBlob], 'url-input.txt', { type: 'text/plain' })
    
    const upload: FileUpload = {
      id: generateId(),
      file: urlFile,
      size: urlFile.size,
      type: urlFile.type,
      uploadedAt: new Date()
    }
    
    addUpload(upload)
    setUploadedFiles([upload])
  }

  const handleFilesChange = (newFiles: FileUpload[]) => {
    console.log('Files changed:', newFiles)
    setUploadedFiles(newFiles)
  }

  const handleProcess = async () => {
    if (uploadedFiles.length === 0) return

    // Check plan limits before processing
    if (!canProcessFile(0, uploadedFiles.length)) {
      setPlanError(`Your ${PLANS[currentPlan].name} plan allows maximum ${planLimits.maxFilesAtOnce} files at once. Please upgrade to process more files.`)
      return
    }

    // Check usage limits if user is authenticated
    if (session?.user?.id) {
      try {
        const usageCheck = await UsageTracker.checkUsageLimit(session.user.id)
        if (!usageCheck.canProceed) {
          alert(`You've reached your daily limit of ${usageCheck.limit} conversions. Please upgrade to Pro for unlimited access.`)
          return
        }
      } catch (error) {
        console.error('Usage limit check failed:', error)
        // Continue processing if we can't check usage
      }
    }

    const job: ProcessingJob = {
      id: generateId(),
      toolId: tool.id,
      status: 'pending',
      progress: 0,
      file: uploadedFiles[0].file, // Use first file for job tracking
      createdAt: new Date()
    }

    addJob(job)
    setCurrentJob(job)
    setIsProcessing(true)

    try {
      updateJob(job.id, { status: 'processing', progress: 10 })

      // Call the new API endpoint for processing
      const formData = new FormData()
      formData.append('toolId', tool.id)
      formData.append('options', JSON.stringify(toolOptions))
      
      // Add all files to form data
      uploadedFiles.forEach((upload, index) => {
        formData.append('files', upload.file)
      })

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Processing failed')
      }

      if (result.success) {
        // Usage tracking is now handled in the API endpoint

        const completedJob: ProcessingJob = {
          ...job,
          status: 'completed',
          progress: 100,
          completedAt: new Date(),
          result: {
            downloadUrl: undefined,
            text: getSuccessMessage(tool.id, result.result),
            metadata: {
              originalSize: result.result?.originalSize || uploadedFiles[0].size,
              processedSize: result.result?.finalSize || result.result?.originalSize || uploadedFiles[0].size,
              processingTime: Date.now() - job.createdAt.getTime(),
              ...getAdditionalMetadata(tool.id, result.result)
            }
          },
          // Store the actual processing result for downloads
          processingResult: result.result
        }
        updateJob(job.id, completedJob)
        setCurrentJob(completedJob)
      } else {
        const errorJob: ProcessingJob = {
          ...job,
          status: 'error',
          progress: 0,
          completedAt: new Date(),
          result: {
            downloadUrl: undefined,
            text: result.error || 'Processing failed',
            metadata: {
              originalSize: result.originalSize,
              processedSize: 0,
              processingTime: Date.now() - job.createdAt.getTime()
            }
          }
        }
        updateJob(job.id, errorJob)
        setCurrentJob(errorJob)
      }
    } catch (error) {
      console.error('Processing error:', error)
      const errorJob: ProcessingJob = {
        ...job,
        status: 'error',
        progress: 0,
        completedAt: new Date(),
        result: {
          downloadUrl: undefined,
          text: error instanceof Error ? error.message : 'Processing failed',
          metadata: {
            originalSize: uploadedFiles[0].size,
            processedSize: 0,
            processingTime: Date.now() - job.createdAt.getTime()
          }
        }
      }
      updateJob(job.id, errorJob)
      setCurrentJob(errorJob)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async (customFilename?: string) => {
    if (currentJob && currentJob.file) {
      try {
        const processingResult = currentJob.processingResult || currentJob.result
        if (processingResult) {
          handleToolDownload(currentJob.toolId, processingResult, currentJob.file.name, customFilename)
        } else {
          console.error('No processing result available for download')
        }
      } catch (error) {
        console.error('Download failed:', error)
      }
    }
  }

  const handleDelete = () => {
    if (currentJob) {
      removeJob(currentJob.id)
      setCurrentJob(null)
    }
    setUploadedFiles([])
  }

  const handleUndo = () => {
    if (currentJob) {
      removeJob(currentJob.id)
      setCurrentJob(null)
    }
  }

  const handleOptionChange = (options: Record<string, any>) => {
    setToolOptions(options)
  }

  const isWebTool = ['html-to-markdown', 'text-extraction', 'screenshot-tool'].includes(tool.id)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      {seoData && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateFAQSchema(seoData.faqSchema))
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateToolSchema(seoData))
            }}
          />
        </>
      )}

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('dashboard')}
              className="btn-ghost p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-heading font-bold text-foreground">
                {seoData?.h1 || tool.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {seoData?.metaDescription || `${tray.name} • ${tool.description}`}
              </p>
            </div>
            
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Usage Indicator */}
      {session?.user?.id && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 border-b border-border py-2"
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <span>{PLANS[currentPlan].name}</span>
              <span>•</span>
              <span>
                {planLimits.maxDailyTasks === -1 ? 'Unlimited' : `${planLimits.maxDailyTasks} conversions/day`}
              </span>
              <span>•</span>
              <span>
                Max {planLimits.maxFileSize === -1 ? 'Unlimited' : formatFileSize(planLimits.maxFileSize)} files
              </span>
              <span>•</span>
              <Link href="/pricing" className="text-foreground hover:underline">
                Upgrade Plan
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Plan Error Display */}
      {planError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-b border-red-200 py-3"
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700 text-sm">{planError}</span>
              </div>
              <Link 
                href="/pricing" 
                className="text-red-700 hover:text-red-800 text-sm font-medium underline"
              >
                View Plans
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Plan Upgrade Prompt for Free Users */}
      {currentPlan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-b border-blue-200 py-3"
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5 text-blue-500" />
                <span className="text-blue-700 text-sm">
                  Upgrade to Pro for larger files, batch processing, and no watermarks
                </span>
              </div>
              <Link 
                href="/pricing" 
                className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <main className="container mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* File Upload Zone */}
          <motion.div variants={itemVariants} className="mb-8">
            <FileUploadZone
              onFileUpload={handleFileUpload}
              acceptedFileTypes={getAcceptedFileTypes(tool.id)}
              maxFiles={getMaxFiles(tool.id)}
              toolId={tool.id}
              isWebTool={isWebTool}
              urlInput={urlInput}
              onUrlChange={setUrlInput}
              onUrlSubmit={handleUrlSubmit}
            />
          </motion.div>

          {/* File Info */}
          {uploadedFiles.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="card">
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={file.id} className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {uploadedFiles.length > 1 ? `${index + 1}. ${file.file.name}` : file.file.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {file.file.type || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {uploadedFiles.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tool Options */}
          {tool.options && tool.options.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <EnhancedToolOptions
                toolId={tool.id}
                options={tool.options}
                files={uploadedFiles}
                onOptionsChange={handleOptionChange}
                onFilesChange={handleFilesChange}
              />
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mb-8">
            <ActionButtons
              hasFile={uploadedFiles.length > 0}
              isProcessing={isProcessing}
              hasResult={currentJob?.status === 'completed'}
              onUpload={() => setUploadedFiles([])}
              onProcess={handleProcess}
              onDownload={handleDownload}
              uploadText="Change File"
              processText="Process"
              downloadText="Download Result"
              disabled={uploadedFiles.length === 0 || isProcessing}
            />
          </motion.div>

          {/* Results Panel */}
          {currentJob && currentJob.status === 'completed' && currentJob.result && (
            <motion.div variants={itemVariants}>
              <ResultsPanel
                result={currentJob.result}
                toolId={tool.id}
                originalFile={uploadedFiles[0]?.file}
                onDownload={handleDownload}
                onCopy={(text: string) => navigator.clipboard.writeText(text)}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
              />
            </motion.div>
          )}

          {/* Error Display */}
          {currentJob && currentJob.status === 'error' && currentJob.result && (
            <motion.div variants={itemVariants} className="card">
              <div className="flex items-center space-x-3 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-medium">Processing Failed</h3>
              </div>
              <p className="mt-2 text-sm text-red-600">
                {currentJob.result.text}
              </p>
            </motion.div>
          )}

          {/* FAQ Section */}
          {seoData && seoData.faqSchema.length > 0 && (
            <motion.div variants={itemVariants} className="mt-12">
              <div className="card">
                <div className="flex items-center space-x-3 mb-6">
                  <HelpCircle className="h-6 w-6 text-foreground" />
                  <h2 className="text-xl font-heading font-semibold text-foreground">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-4">
                  {seoData.faqSchema.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="font-medium text-foreground group-open:text-blue-600">
                          {faq.question}
                        </h3>
                        <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-3 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Related Tools */}
          {seoData && seoData.relatedTools.length > 0 && (
            <motion.div variants={itemVariants} className="mt-8">
              <div className="card">
                <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Related Tools
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {seoData.relatedTools.map((relatedToolId) => {
                    const relatedSeoData = getSEODataByToolId(relatedToolId)
                    if (!relatedSeoData) return null
                    
                    return (
                      <Link
                        key={relatedToolId}
                        href={`/${relatedSeoData.slug}`}
                        className="block p-4 rounded-lg border border-border hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                      >
                        <h3 className="font-medium text-foreground mb-1">
                          {relatedSeoData.h1}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {relatedSeoData.metaDescription.split('.')[0]}...
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

// Helper functions
function getAcceptedFileTypes(toolId: string): Record<string, string[]> {
  switch (toolId) {
    case 'pdf-merge':
    case 'pdf-compress':
    case 'pdf-extract':
    case 'pdf-to-office':
      return { 'application/pdf': ['.pdf'] }
    case 'excel-to-csv':
      return { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }
    case 'csv-to-excel':
      return { 'text/csv': ['.csv'] }
    case 'json-formatter':
      return { 'application/json': ['.json'], 'text/plain': ['.txt'] }
    case 'excel-cleaner':
      return { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] }
    case 'image-compression':
    case 'format-conversion':
    case 'background-removal':
      return { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff'] }
    case 'ocr-extraction':
      return { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'], 'application/pdf': ['.pdf'] }
    case 'html-to-markdown':
      return { 'text/html': ['.html', '.htm'], 'text/plain': ['.txt'] }
    case 'text-extraction':
      return { 'text/plain': ['.txt'] }
    case 'screenshot-tool':
      return { 'text/plain': ['.txt'] }

    case 'pdf-to-office':
      return { 'application/pdf': ['.pdf'] }
    case 'sql-formatter':
      return { 'text/plain': ['.sql', '.txt'] }
    case 'background-removal':
      return { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }
    default:
      return {
        'application/pdf': ['.pdf'],
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        'text/csv': ['.csv'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/json': ['.json'],
        'text/html': ['.html', '.htm'],
        'text/plain': ['.txt']
      }
  }
}

function getMaxFiles(toolId: string) {
  switch (toolId) {
    // Tools that logically support multiple files
    case 'pdf-merge':
      return 10 // Multiple PDFs for merging
    case 'image-compression':
    case 'format-conversion':
      return 5 // Batch image processing
    case 'ocr-extraction':
      return 3 // Multiple images for text extraction

    
    // All other tools work with single files
    case 'pdf-compress':
    case 'pdf-extract':
    case 'excel-to-csv':
    case 'csv-to-excel':
    case 'json-formatter':
    case 'excel-cleaner':
    case 'html-to-markdown':
    case 'text-extraction':
    case 'screenshot-tool':

    case 'pdf-to-office':
    case 'sql-formatter':
    case 'background-removal':
    default:
      return 1
  }
}

function getSuccessMessage(toolId: string, result: any) {
  switch (toolId) {
    case 'pdf-merge':
      return `Successfully merged ${result.pageCount} pages from ${result.originalSize ? Math.ceil(result.originalSize / 1024) : 0}KB to ${result.finalSize ? Math.ceil(result.finalSize / 1024) : 0}KB`
    case 'pdf-compress':
      return `Successfully compressed PDF with ${result.compressionRatio}% size reduction`
    case 'pdf-extract':
      return `Successfully extracted ${result.extractedPages} pages`
    case 'excel-to-csv':
      return `Successfully converted Excel to CSV with ${result.rowCount} rows`
    case 'csv-to-excel':
      return `Successfully converted CSV to Excel with ${result.rowCount} rows`
    case 'json-formatter':
      return `Successfully formatted JSON${result.isValid ? ' (valid)' : ' (validation errors found)'}`
    case 'excel-cleaner':
      return `Successfully cleaned Excel file: removed ${result.metadata?.duplicatesRemoved || 0} duplicates, ${result.metadata?.emptyRowsRemoved || 0} empty rows`
    case 'image-compression':
      if (result.filesProcessed > 1) {
        return `Successfully compressed ${result.filesProcessed} images with avg ${result.compressionRatio}% size reduction`
      }
      return `Successfully compressed image with ${result.compressionRatio}% size reduction`
    case 'format-conversion':
      if (result.filesProcessed > 1) {
        return `Successfully converted ${result.filesProcessed} images${result.finalFormat ? ` to ${result.finalFormat} format` : ''}`
      }
      return `Successfully converted image to ${result.finalFormat} format`
    case 'ocr-extraction':
      if (result.filesProcessed > 1) {
        return `Successfully extracted text from ${result.filesProcessed} images with avg ${result.confidence}% confidence`
      }
      return `Successfully extracted text with ${result.confidence}% confidence`
    case 'html-to-markdown':
      return `Successfully converted HTML to Markdown`
    case 'text-extraction':
      return `Successfully extracted ${result.metadata?.wordCount || 0} words from webpage`
    case 'screenshot-tool':
      return `Successfully captured screenshot (${result.metadata?.width}x${result.metadata?.height})`

    case 'pdf-to-office':
      return `Successfully converted PDF to ${result.metadata?.outputFormat === 'docx' ? 'Word' : 'Excel'} format`
    case 'sql-formatter':
      return `Successfully formatted SQL with ${result.metadata?.indentation || '2'} space indentation`
    case 'background-removal':
      return `Successfully removed background with ${result.metadata?.tolerance || 50}% tolerance`
    default:
      return 'Processing completed successfully!'
  }
}

function getAdditionalMetadata(toolId: string, result: any) {
  switch (toolId) {
    case 'pdf-merge':
      return { pageCount: result.pageCount }
    case 'pdf-compress':
      return { compressionRatio: result.compressionRatio }
    case 'pdf-extract':
      return { extractedPages: result.extractedPages }
    case 'excel-to-csv':
    case 'csv-to-excel':
      return { rowCount: result.rowCount, sheetCount: result.sheetCount }
    case 'json-formatter':
      return { isValid: result.isValid, errors: result.errors }
    case 'excel-cleaner':
      return { 
        duplicatesRemoved: result.metadata?.duplicatesRemoved,
        emptyRowsRemoved: result.metadata?.emptyRowsRemoved,
        columnsNormalized: result.metadata?.columnsNormalized?.length,
        dataTypesFixed: Object.keys(result.metadata?.dataTypesFixed || {}).length
      }
    case 'image-compression':
      return { 
        compressionRatio: result.compressionRatio, 
        finalFormat: result.finalFormat,
        filesProcessed: result.filesProcessed,
        filesFailed: result.filesFailed
      }
    case 'format-conversion':
      return { 
        finalFormat: result.finalFormat,
        filesProcessed: result.filesProcessed,
        filesFailed: result.filesFailed
      }
    case 'ocr-extraction':
      return { 
        confidence: result.confidence, 
        wordCount: result.wordCount,
        filesProcessed: result.filesProcessed,
        filesFailed: result.filesFailed
      }
    case 'html-to-markdown':
      return { conversionRatio: result.conversionRatio }
    case 'text-extraction':
      return { wordCount: result.wordCount }
    case 'screenshot-tool':
      return { width: result.metadata?.width, height: result.metadata?.height }

    case 'pdf-to-office':
      return { 
        outputFormat: result.metadata?.outputFormat,
        pageCount: result.metadata?.pageCount,
        tablesExtracted: result.metadata?.tablesExtracted
      }
    case 'sql-formatter':
      return { 
        indentation: result.metadata?.indentation,
        caseStyle: result.metadata?.caseStyle,
        keywordsAligned: result.metadata?.keywordsAligned
      }
    case 'background-removal':
      return { 
        tolerance: result.metadata?.tolerance,
        outputFormat: result.metadata?.outputFormat,
        quality: result.metadata?.quality
      }
    default:
      return {}
  }
}
