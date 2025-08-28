'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Undo2, Download, Trash2, FileText, Image, FileSpreadsheet, Code } from 'lucide-react'
import { ProcessingJob } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'

interface ProcessingHistoryProps {
  jobs: ProcessingJob[]
  onUndo: (jobId: string) => void
  onDownload: (jobId: string) => void
  onDelete: (jobId: string) => void
}

const getFileIcon = (toolId: string) => {
  if (toolId.includes('pdf')) return <FileText className="h-4 w-4" />
  if (toolId.includes('image') || toolId.includes('ocr')) return <Image className="h-4 w-4" />
  if (toolId.includes('excel') || toolId.includes('csv')) return <FileSpreadsheet className="h-4 w-4" />
  if (toolId.includes('json') || toolId.includes('html')) return <Code className="h-4 w-4" />
  return <FileText className="h-4 w-4" />
}

const getToolName = (toolId: string) => {
  const toolNames: Record<string, string> = {
    'pdf-merge': 'PDF Merge',
    'pdf-compress': 'PDF Compress',
    'pdf-extract': 'PDF Extract',
    'excel-to-csv': 'Excel to CSV',
    'csv-to-excel': 'CSV to Excel',
    'json-formatter': 'JSON Formatter',
    'image-compression': 'Image Compression',
    'format-conversion': 'Format Conversion',
    'ocr-extraction': 'OCR Extraction',
    'html-to-markdown': 'HTML to Markdown',
    'text-extraction': 'Text Extraction',
    'screenshot-tool': 'Screenshot',

  }
  return toolNames[toolId] || toolId
}

export default function ProcessingHistory({ jobs, onUndo, onDownload, onDelete }: ProcessingHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Get last 5 completed jobs
  const recentJobs = jobs
    .filter(job => job.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
    .slice(0, 5)

  if (recentJobs.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-background border border-border rounded-2xl shadow-2xl p-4 w-80 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Recent Files</h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
              >
                <span className="text-muted-foreground">×</span>
              </button>
            </div>

            {/* Jobs List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-3 p-3 bg-muted/50 rounded-xl"
                >
                  <div className="flex-shrink-0 text-muted-foreground">
                    {getFileIcon(job.toolId)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {getToolName(job.toolId)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {job.completedAt?.toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1">
                    {job.result?.downloadUrl && (
                      <button
                        onClick={() => onDownload(job.id)}
                        className="p-1 hover:bg-accent rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onUndo(job.id)}
                      className="p-1 hover:bg-accent rounded-lg transition-colors"
                      title="Undo"
                    >
                      <Undo2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                    
                    <button
                      onClick={() => onDelete(job.id)}
                      className="p-1 hover:bg-accent rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {recentJobs.length} recent files processed
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsExpanded(true)}
            className="bg-background border border-border rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            title="Show recent files"
          >
            <Clock className="h-5 w-5 text-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
