'use client'

import { motion } from 'framer-motion'
import { Upload, FileText, Image, FileSpreadsheet, Code, Globe } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { FileUpload } from '@/types'

interface FileUploadZoneProps {
  onFileUpload: (upload: FileUpload | FileUpload[]) => void
  acceptedFileTypes: Record<string, string[]>
  maxFiles?: number
  toolId: string
  isWebTool?: boolean
  urlInput?: string
  onUrlChange?: (url: string) => void
  onUrlSubmit?: () => void
}

export default function FileUploadZone({
  onFileUpload,
  acceptedFileTypes,
  maxFiles = 1,
  toolId,
  isWebTool = false,
  urlInput = '',
  onUrlChange,
  onUrlSubmit
}: FileUploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedFileTypes,
    maxFiles,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        if (maxFiles === 1 || acceptedFiles.length === 1) {
          // Single file upload
          const file = acceptedFiles[0]
          const upload: FileUpload = {
            id: crypto.randomUUID(),
            file,
            size: file.size,
            type: file.type,
            uploadedAt: new Date()
          }
          onFileUpload(upload)
        } else {
          // Multiple file upload
          const uploads: FileUpload[] = acceptedFiles.map(file => ({
            id: crypto.randomUUID(),
            file,
            size: file.size,
            type: file.type,
            uploadedAt: new Date()
          }))
          onFileUpload(uploads)
        }
      }
    }
  })

  const getToolIcon = () => {
    if (toolId.includes('pdf')) return <FileText className="h-16 w-16" />
    if (toolId.includes('image') || toolId.includes('ocr')) return <Image className="h-16 w-16" />
    if (toolId.includes('excel') || toolId.includes('csv')) return <FileSpreadsheet className="h-16 w-16" />
    if (toolId.includes('json') || toolId.includes('html')) return <Code className="h-16 w-16" />
    if (isWebTool) return <Globe className="h-16 w-16" />
    return <Upload className="h-16 w-16" />
  }

  const getToolDescription = () => {
    if (isWebTool) {
      return 'Enter a URL to process'
    }
    
    switch (toolId) {
      case 'pdf-merge':
        return 'Supports multiple PDF files for merging'
      case 'pdf-compress':
      case 'pdf-extract':
        return 'Supports PDF files'
      case 'excel-to-csv':
        return 'Supports Excel files (.xlsx)'
      case 'csv-to-excel':
        return 'Supports CSV files'
      case 'json-formatter':
        return 'Supports JSON files'
      case 'image-compression':
      case 'format-conversion':
        return 'Supports image files (PNG, JPG, JPEG, GIF, WebP)'
      case 'ocr-extraction':
        return 'Supports image files for text extraction'
      case 'html-to-markdown':
        return 'Supports HTML files'
      case 'text-summarization':
      case 'content-cleaning':
      case 'smart-processing':
        return 'Supports text files and PDFs'
      default:
        return 'Supports various file types'
    }
  }

  const getAcceptedTypesText = () => {
    const types = Object.keys(acceptedFileTypes)
    if (types.length === 0) return ''
    
    const extensions = types.flatMap(type => acceptedFileTypes[type])
    return extensions.map(ext => ext.replace('.', '')).join(', ').toUpperCase()
  }

  if (isWebTool) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center py-12"
      >
        <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          Enter URL
        </h3>
        <p className="text-muted-foreground mb-6">
          Paste the URL you want to process
        </p>
        <div className="max-w-md mx-auto space-y-4">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => onUrlChange?.(e.target.value)}
            placeholder="https://example.com"
            className="input w-full"
          />
          <button
            onClick={onUrlSubmit}
            disabled={!urlInput.trim()}
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use URL
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        {...getRootProps()}
        className={`card border-2 border-dashed border-border text-center py-16 transition-all duration-200 cursor-pointer hover:border-foreground/30 ${
          isDragActive ? 'border-foreground/50 bg-accent' : ''
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="text-muted-foreground mb-4">
          {getToolIcon()}
        </div>
        
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          {isDragActive ? 'Drop files here' : maxFiles > 1 ? 'Drop files here' : 'Drop file here'}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          Or click to browse file{maxFiles > 1 ? 's' : ''}
        </p>
        
        <p className="text-sm text-muted-foreground mb-2">
          {getToolDescription()}
        </p>
        
        {getAcceptedTypesText() && (
          <p className="text-xs text-muted-foreground/70">
            Accepted: {getAcceptedTypesText()}
          </p>
        )}
        
        {maxFiles > 1 && (
          <p className="text-xs text-muted-foreground/70 mt-2">
            Max {maxFiles} file{maxFiles > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </motion.div>
  )
}
