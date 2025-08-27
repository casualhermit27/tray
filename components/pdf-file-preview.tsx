'use client'

import { useState, useRef } from 'react'
import { motion, Reorder } from 'framer-motion'
import { FileText, X, Move, Eye, Trash2, Plus } from 'lucide-react'
import { FileUpload } from '@/types'

interface PDFFilePreviewProps {
  files: FileUpload[]
  onReorder: (files: FileUpload[]) => void
  onRemove: (fileId: string) => void
  onAddBlankPage: () => void
  showBlankPageOption?: boolean
}

interface PDFThumbnailProps {
  file: FileUpload
  index: number
  onRemove: (fileId: string) => void
  onPreview: (file: FileUpload) => void
}

function PDFThumbnail({ file, index, onRemove, onPreview }: PDFThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group cursor-move"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <div className="relative bg-muted rounded-lg p-3 border-2 border-border hover:border-primary/50 transition-all duration-200 min-h-[120px] flex flex-col items-center justify-center">
        {/* File Icon */}
        <FileText className="h-12 w-12 text-muted-foreground mb-2" />
        
        {/* File Info */}
        <div className="text-center">
          <p className="text-xs font-medium text-foreground truncate max-w-[100px]">
            {file.file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {Math.round(file.size / 1024)} KB
          </p>
        </div>
        
        {/* Index Badge */}
        <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {index + 1}
        </div>
        
        {/* Hover Actions */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center space-x-2 z-20"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPreview(file)
              }}
              className="p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
              title="Preview"
            >
              <Eye className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Remove button clicked for file:', file.id)
                onRemove(file.id)
              }}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors z-10 relative"
              title="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
        
        {/* Drag Handle */}
        <div className="absolute top-2 right-2 text-muted-foreground/50 group-hover:text-muted-foreground">
          <Move className="h-4 w-4" />
        </div>
        
        {/* Always Visible Remove Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('Remove button clicked for file:', file.id)
            onRemove(file.id)
          }}
          className="absolute top-2 left-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors z-10 opacity-0 group-hover:opacity-100"
          title="Remove"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  )
}

export default function PDFFilePreview({
  files,
  onReorder,
  onRemove,
  onAddBlankPage,
  showBlankPageOption = false
}: PDFFilePreviewProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p>No PDF files uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          PDF Files ({files.length})
        </h3>
        {showBlankPageOption && (
          <button
            onClick={onAddBlankPage}
            className="flex items-center space-x-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Blank Page</span>
          </button>
        )}
      </div>
      
      {/* Reorderable Grid */}
      <Reorder.Group
        axis="y"
        values={files}
        onReorder={onReorder}
        className="space-y-3"
      >
        {files.map((file, index) => (
          <Reorder.Item
            key={file.id}
            value={file}
            className="w-full"
            whileDrag={{ scale: 1.02, zIndex: 10 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          >
            <PDFThumbnail
              file={file}
              index={index}
              onRemove={onRemove}
              onPreview={(file) => {
                // Open file in new tab for preview
                const url = URL.createObjectURL(file.file)
                window.open(url, '_blank')
              }}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      
      {/* Instructions */}
      <div className="text-sm text-muted-foreground text-center py-2 border-t border-border">
        <p>Drag and drop to reorder files • Hover for actions</p>
      </div>
    </div>
  )
}
