'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ToolOption } from '@/types'
import { FileUpload } from '@/types'
import PDFFilePreview from './pdf-file-preview'
import PDFCompressionPreview from './pdf-compression-preview'
import PDFPageSelector from './pdf-page-selector'

interface EnhancedToolOptionsProps {
  toolId: string
  options: ToolOption[]
  files: FileUpload[]
  onOptionsChange: (options: Record<string, any>) => void
  onFilesChange?: (files: FileUpload[]) => void
  className?: string
}

export default function EnhancedToolOptions({
  toolId,
  options,
  files,
  onOptionsChange,
  onFilesChange,
  className = ''
}: EnhancedToolOptionsProps) {
  const [currentOptions, setCurrentOptions] = useState<Record<string, any>>({})
  const [showSpecializedUI, setShowSpecializedUI] = useState(false)

  // Render standard options for tools without specialized UI
  const renderStandardOptions = () => {
    return options.map(option => {
      switch (option.type) {
        case 'select':
          return (
            <div key={option.id} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {option.name}
              </label>
              <select
                value={currentOptions[option.id] || option.defaultValue}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                {option.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          )

        case 'slider':
          return (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {option.name}
                </label>
                <span className="text-sm text-muted-foreground">
                  {currentOptions[option.id] || option.defaultValue}
                </span>
              </div>
              <input
                type="range"
                min={option.min || 0}
                max={option.max || 100}
                step={option.step || 1}
                value={currentOptions[option.id] || option.defaultValue}
                onChange={(e) => handleOptionChange(option.id, Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{option.min || 0}</span>
                <span>{option.max || 100}</span>
              </div>
            </div>
          )

        case 'toggle':
          return (
            <div key={option.id} className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {option.name}
              </label>
              <button
                type="button"
                onClick={() => handleOptionChange(option.id, !(currentOptions[option.id] ?? option.defaultValue))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  currentOptions[option.id] ?? option.defaultValue
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    currentOptions[option.id] ?? option.defaultValue
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )

        case 'input':
          return (
            <div key={option.id} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {option.name}
              </label>
              <input
                type="text"
                placeholder={option.placeholder || ''}
                value={currentOptions[option.id] || option.defaultValue}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          )

        default:
          return null
      }
    })
  }

  

  useEffect(() => {
    // Initialize options with default values
    const initialOptions: Record<string, any> = {}
    options.forEach(option => {
      initialOptions[option.id] = option.defaultValue
    })
    setCurrentOptions(initialOptions)
    onOptionsChange(initialOptions)
    
    // Check if this tool should show specialized UI
    setShowSpecializedUI(['pdf-merge', 'pdf-compress', 'pdf-extract'].includes(toolId))
  }, [options, onOptionsChange, toolId])

  const handleOptionChange = (optionId: string, value: any) => {
    const newOptions = { ...currentOptions, [optionId]: value }
    setCurrentOptions(newOptions)
    onOptionsChange(newOptions)
  }

  const handleFileReorder = (reorderedFiles: FileUpload[]) => {
    if (onFilesChange) {
      onFilesChange(reorderedFiles)
    }
  }

  const handleFileRemove = (fileId: string) => {
    if (onFilesChange) {
      const updatedFiles = files.filter(file => file.id !== fileId)
      onFilesChange(updatedFiles)
    }
  }

  const handleAddBlankPage = () => {
    if (onFilesChange) {
      // Create a placeholder for a blank page
      const blankPage: FileUpload = {
        id: crypto.randomUUID(),
        file: new File([''], 'blank-page.pdf', { type: 'application/pdf' }),
        size: 0,
        type: 'application/pdf',
        uploadedAt: new Date()
      }
      onFilesChange([...files, blankPage])
    }
  }

  const handlePageSelectionChange = (selectedPages: number[]) => {
    // Update the page-range option
    const pageRange = selectedPages.length > 0 ? selectedPages.join(',') : '1'
    handleOptionChange('page-range', pageRange)
  }

  const handleModeChange = (mode: 'extract' | 'delete') => {
    handleOptionChange('delete-mode', mode === 'delete')
  }

  const handleOutputFormatChange = (format: 'pdf' | 'images') => {
    handleOptionChange('extract-format', format)
  }

  // Render specialized UI for specific tools
  if (showSpecializedUI) {
    switch (toolId) {
      case 'pdf-merge':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">PDF Merge Options</h3>
            
            {/* PDF File Preview with Reordering */}
            <PDFFilePreview
              files={files}
              onReorder={handleFileReorder}
              onRemove={handleFileRemove}
              onAddBlankPage={handleAddBlankPage}
              showBlankPageOption={currentOptions['insert-blank-pages']}
            />
            
            {/* Standard Options */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-foreground">Merge Settings</h4>
              {renderStandardOptions()}
            </div>
          </motion.div>
        )

      case 'pdf-compress':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">PDF Compression Options</h3>
            
            {/* PDF Compression Preview */}
            <PDFCompressionPreview
              files={files}
              compressionLevel={currentOptions['compression-level'] || 'balanced'}
              onCompressionChange={(level) => handleOptionChange('compression-level', level)}
              batchMode={currentOptions['batch-mode'] || false}
              onBatchModeChange={(enabled) => handleOptionChange('batch-mode', enabled)}
            />
          </motion.div>
        )

      case 'pdf-extract':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">PDF Extract Options</h3>
            
            {/* PDF Page Selector */}
            {files.length > 0 && (
              <PDFPageSelector
                file={files[0]}
                onPageSelectionChange={handlePageSelectionChange}
                mode={currentOptions['delete-mode'] ? 'delete' : 'extract'}
                onModeChange={handleModeChange}
                outputFormat={currentOptions['extract-format'] || 'pdf'}
                onOutputFormatChange={handleOutputFormatChange}
              />
            )}
          </motion.div>
        )

      default:
        break
    }
  }



  if (!options || options.length === 0) {
    return null
  }

  // For tools without specialized UI, render standard options
  if (!showSpecializedUI) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`space-y-4 ${className}`}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Tool Options</h3>
        <div className="space-y-4">
          {renderStandardOptions()}
        </div>
      </motion.div>
    )
  }

  return null
}
