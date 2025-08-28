'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Eye, EyeOff, CheckCircle, AlertCircle, Edit3 } from 'lucide-react'
import { ProcessingResult } from '@/types'
import { formatFileSize, formatDuration } from '@/lib/utils'

interface ResultsPanelProps {
  result: ProcessingResult
  toolId: string
  originalFile: File
  onDownload: (customFilename?: string) => void
  onCopy?: (text: string) => void
  showPreview?: boolean
  onTogglePreview?: () => void
}

export default function ResultsPanel({
  result,
  toolId,
  originalFile,
  onDownload,
  onCopy,
  showPreview = true,
  onTogglePreview
}: ResultsPanelProps) {
  const [isEditingFilename, setIsEditingFilename] = useState(false)
  const [customFilename, setCustomFilename] = useState('')
  
  const hasPreview = result.previewUrl || result.text
  const hasDownload = result.downloadUrl

  // Generate suggested filename based on tool
  const getSuggestedFilename = () => {
    const baseName = originalFile.name.replace(/\.[^/.]+$/, '') // Remove original extension
    let prefix = ''
    let extension = ''
    
    switch (toolId) {
      case 'pdf-merge':
        prefix = 'merged'
        extension = 'pdf'
        break
      case 'pdf-compress':
        prefix = 'compressed'
        extension = 'pdf'
        break
      case 'pdf-extract':
        prefix = 'extracted'
        extension = 'pdf'
        break
      case 'excel-to-csv':
        prefix = 'converted'
        extension = 'csv'
        break
      case 'csv-to-excel':
        prefix = 'converted'
        extension = 'xlsx'
        break
      case 'json-formatter':
        prefix = 'formatted'
        extension = 'json'
        break
      case 'excel-cleaner':
        prefix = 'cleaned'
        extension = 'xlsx'
        break
      case 'image-compression':
        prefix = 'compressed'
        extension = result.metadata?.finalFormat || 'jpg'
        break
      case 'format-conversion':
        prefix = 'converted'
        extension = result.metadata?.finalFormat || 'jpg'
        break
      case 'ocr-extraction':
        prefix = 'extracted'
        extension = 'txt'
        break
      case 'html-to-markdown':
        prefix = 'converted'
        extension = 'md'
        break
      case 'text-extraction':
        prefix = 'extracted'
        extension = 'txt'
        break
      case 'screenshot-tool':
        prefix = 'screenshot'
        extension = 'png'
        break

      case 'pdf-to-office':
        prefix = 'converted'
        extension = result.metadata?.outputFormat === 'docx' ? 'docx' : 'xlsx'
        break
      case 'sql-formatter':
        prefix = 'formatted'
        extension = 'sql'
        break
      case 'background-removal':
        prefix = 'no-background'
        extension = result.metadata?.outputFormat || 'png'
        break

      default:
        prefix = 'processed'
        extension = 'txt'
    }
    
    return `${prefix}_${baseName}.${extension}`
  }

  const handleDownloadWithRename = () => {
    if (isEditingFilename && customFilename.trim()) {
      onDownload(customFilename.trim())
    } else {
      onDownload()
    }
    setIsEditingFilename(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const renderPreviewContent = () => {
    if (result.text) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Result Preview</h4>
            {onCopy && (
              <button
                onClick={() => onCopy(result.text!)}
                className="btn-ghost p-2 text-sm"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="bg-muted/50 rounded-lg p-3 max-h-40 overflow-y-auto">
            <pre className="text-sm text-foreground whitespace-pre-wrap break-words">
              {result.text}
            </pre>
          </div>
        </div>
      )
    }

    if (result.previewUrl) {
      return (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Preview</h4>
          <div className="bg-muted/50 rounded-lg p-3">
            <img
              src={result.previewUrl}
              alt="Preview"
              className="max-w-full h-auto rounded"
            />
          </div>
        </div>
      )
    }

    return null
  }

  const renderMetadata = () => {
    if (!result.metadata) return null

    const metadataItems = [
      { label: 'Original Size', value: formatFileSize(result.metadata.originalSize) },
      { label: 'Processed Size', value: formatFileSize(result.metadata.processedSize) },
      { label: 'Processing Time', value: formatDuration(result.metadata.processingTime) }
    ]

    // Add tool-specific metadata
    if (toolId.includes('pdf') && result.metadata.pageCount) {
      metadataItems.push({ label: 'Pages', value: result.metadata.pageCount.toString() })
    }

    if (toolId.includes('compression') && result.metadata.compressionRatio) {
      metadataItems.push({ label: 'Compression', value: `${result.metadata.compressionRatio}%` })
    }

    if (toolId.includes('ocr') && result.metadata.confidence) {
      metadataItems.push({ label: 'Confidence', value: `${result.metadata.confidence}%` })
    }

    return (
      <div className="grid grid-cols-2 gap-4 text-sm">
        {metadataItems.map((item, index) => (
          <div key={index}>
            <span className="text-muted-foreground">{item.label}:</span>
            <span className="ml-2 font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Processing Complete
          </h3>
        </div>
        
        {hasPreview && onTogglePreview && (
          <button
            onClick={onTogglePreview}
            className="btn-ghost p-2 text-sm"
            title={showPreview ? 'Hide preview' : 'Show preview'}
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Success Message */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          {result.text || 'File processed successfully!'}
        </p>
      </div>

      {/* Preview Section */}
      {showPreview && hasPreview && (
        <div className="border-t border-border pt-6">
          {renderPreviewContent()}
        </div>
      )}

      {/* Metadata */}
      {result.metadata && (
        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-4">Processing Details</h4>
          {renderMetadata()}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-border pt-6 space-y-4">
        {/* Filename Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Download Options</h4>
            <div className="text-sm text-muted-foreground">
              Original: {originalFile.name}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              {isEditingFilename ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    placeholder={getSuggestedFilename()}
                    className="input w-full"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleDownloadWithRename()
                      } else if (e.key === 'Escape') {
                        setIsEditingFilename(false)
                        setCustomFilename('')
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Press Enter to save, Escape to cancel. Default: {getSuggestedFilename()}
                  </p>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground font-medium">
                    {customFilename || getSuggestedFilename()}
                  </span>
                  <button
                    onClick={() => {
                      setIsEditingFilename(true)
                      setCustomFilename(getSuggestedFilename())
                    }}
                    className="btn-ghost p-1 text-xs"
                    title="Rename file"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadWithRename}
              className="btn-ghost bg-foreground text-background hover:bg-foreground/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Result
            </button>
            
            {result.text && onCopy && (
              <button
                onClick={() => copyToClipboard(result.text!)}
                className="btn-ghost"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </button>
            )}
          </div>

          {isEditingFilename && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadWithRename}
                className="btn-ghost bg-green-600 text-white hover:bg-green-700 px-3 py-1 text-xs"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingFilename(false)
                  setCustomFilename('')
                }}
                className="btn-ghost px-3 py-1 text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
