'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Zap, BarChart3 } from 'lucide-react'
import { FileUpload } from '@/types'

interface PDFCompressionPreviewProps {
  files: FileUpload[]
  compressionLevel: 'high-quality' | 'balanced' | 'max-compression'
  onCompressionChange: (level: 'high-quality' | 'balanced' | 'max-compression') => void
  batchMode: boolean
  onBatchModeChange: (enabled: boolean) => void
}

const compressionLevels = [
  { id: 'high-quality', label: 'High Quality', description: 'Minimal compression, best quality', color: 'bg-green-500' },
  { id: 'balanced', label: 'Balanced', description: 'Good balance of size and quality', color: 'bg-yellow-500' },
  { id: 'max-compression', label: 'Smallest Size', description: 'Maximum compression, smaller files', color: 'bg-red-500' }
] as const

export default function PDFCompressionPreview({
  files,
  compressionLevel,
  onCompressionChange,
  batchMode,
  onBatchModeChange
}: PDFCompressionPreviewProps) {
  const [estimatedSizes, setEstimatedSizes] = useState<Record<string, number>>({})
  
  // Calculate estimated compressed sizes
  useEffect(() => {
    const sizes: Record<string, number> = {}
    files.forEach(file => {
      const originalSize = file.size
      let compressionRatio = 1
      
      switch (compressionLevel) {
        case 'high-quality':
          compressionRatio = 0.9 // 10% reduction
          break
        case 'balanced':
          compressionRatio = 0.7 // 30% reduction
          break
        case 'max-compression':
          compressionRatio = 0.5 // 50% reduction
          break
      }
      
      sizes[file.id] = Math.round(originalSize * compressionRatio)
    })
    setEstimatedSizes(sizes)
  }, [files, compressionLevel])

  const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0)
  const totalEstimatedSize = Object.values(estimatedSizes).reduce((sum, size) => sum + size, 0)
  const totalSavings = totalOriginalSize - totalEstimatedSize
  const totalSavingsPercent = Math.round((totalSavings / totalOriginalSize) * 100)

  return (
    <div className="space-y-6">
      {/* Compression Level Slider */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Compression Level</h3>
        
        {/* Large Visual Slider */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm font-medium text-foreground">High Quality</p>
              <p className="text-xs text-muted-foreground">Best quality</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-sm font-medium text-foreground">Balanced</p>
              <p className="text-xs text-muted-foreground">Good balance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <Download className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-sm font-medium text-foreground">Smallest Size</p>
              <p className="text-xs text-muted-foreground">Max compression</p>
            </div>
          </div>
          
          {/* Slider Track */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-20" />
            
            {/* Slider Thumb */}
            <motion.div
              className="absolute top-0 w-6 h-6 bg-foreground rounded-full shadow-lg cursor-pointer"
              style={{
                left: compressionLevel === 'high-quality' ? '0%' : 
                      compressionLevel === 'balanced' ? '50%' : '100%',
                transform: 'translateX(-50%)'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            
            {/* Clickable Areas */}
            <div className="absolute inset-0 flex">
              <button
                onClick={() => onCompressionChange('high-quality')}
                className="flex-1 h-full cursor-pointer"
              />
              <button
                onClick={() => onCompressionChange('balanced')}
                className="flex-1 h-full cursor-pointer"
              />
              <button
                onClick={() => onCompressionChange('max-compression')}
                className="flex-1 h-full cursor-pointer"
              />
            </div>
          </div>
          
          {/* Level Indicators */}
          <div className="flex justify-between mt-2">
            {compressionLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => onCompressionChange(level.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  compressionLevel === level.id
                    ? `${level.color} text-white`
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Size Comparison */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Size Comparison</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <div className="card p-4 border-2 border-border">
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div>
                <h4 className="font-medium text-foreground">Original Size</h4>
                <p className="text-sm text-muted-foreground">Before compression</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {(totalOriginalSize / 1024 / 1024).toFixed(1)} MB
            </div>
          </div>
          
          {/* After */}
          <div className="card p-4 border-2 border-primary/20 bg-primary/5">
            <div className="flex items-center space-x-3 mb-3">
              <Download className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-medium text-foreground">Estimated Size</h4>
                <p className="text-sm text-muted-foreground">After compression</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {(totalEstimatedSize / 1024 / 1024).toFixed(1)} MB
            </div>
          </div>
        </div>
        
        {/* Savings */}
        <div className="card p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-800">Total Savings</h4>
              <p className="text-sm text-green-600">
                {totalSavingsPercent}% smaller • {(totalSavings / 1024 / 1024).toFixed(1)} MB saved
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Batch Mode Toggle */}
      {files.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Batch Processing</h3>
          
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">Apply to All Files</h4>
              <p className="text-sm text-muted-foreground">
                Use the same compression level for all {files.length} files
              </p>
            </div>
            
            <button
              onClick={() => onBatchModeChange(!batchMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                batchMode ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  batchMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Individual File Preview */}
      {files.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">File Details</h3>
          
          <div className="space-y-3">
            {files.map((file, index) => {
              const originalSize = file.size
              const estimatedSize = estimatedSizes[file.id] || originalSize
              const savings = originalSize - estimatedSize
              const savingsPercent = Math.round((savings / originalSize) * 100)
              
              return (
                <div key={file.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm truncate max-w-[200px]">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(originalSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">
                      {(estimatedSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-green-600">
                      -{savingsPercent}% ({Math.round(savings / 1024)} KB)
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
