'use client'

import { motion } from 'framer-motion'
import { Upload, Download, Play, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface ActionButtonsProps {
  hasFile: boolean
  isProcessing: boolean
  hasResult: boolean
  onUpload: () => void
  onProcess: () => void
  onDownload: () => void
  uploadText?: string
  processText?: string
  downloadText?: string
  disabled?: boolean
}

export default function ActionButtons({
  hasFile,
  isProcessing,
  hasResult,
  onUpload,
  onProcess,
  onDownload,
  uploadText = 'Upload File',
  processText = 'Process',
  downloadText = 'Download',
  disabled = false
}: ActionButtonsProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto"
    >
      {/* Upload Button - Always visible */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onUpload}
        disabled={disabled || isProcessing}
        className="btn-ghost w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploadText}
      </motion.button>

      {/* Process Button - Only visible when file is uploaded */}
      {hasFile && (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onProcess}
          disabled={disabled || isProcessing}
          className="btn-ghost w-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              {processText}
            </>
          )}
        </motion.button>
      )}

      {/* Download Button - Only visible when processing is complete */}
      {hasResult && (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onDownload}
          disabled={disabled}
          className="btn-ghost w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4 mr-2" />
          {downloadText}
        </motion.button>
      )}

      {/* Status Indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 text-sm text-muted-foreground"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing your file...</span>
        </motion.div>
      )}

      {hasResult && !isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 text-sm text-green-600"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Processing complete!</span>
        </motion.div>
      )}
    </motion.div>
  )
}
