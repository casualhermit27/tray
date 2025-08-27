'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Check, Square, Scissors, Trash2 } from 'lucide-react'
import { FileUpload } from '@/types'

interface PDFPageSelectorProps {
  file: FileUpload
  onPageSelectionChange: (selectedPages: number[]) => void
  mode: 'extract' | 'delete'
  onModeChange: (mode: 'extract' | 'delete') => void
  outputFormat: 'pdf' | 'images'
  onOutputFormatChange: (format: 'pdf' | 'images') => void
}

interface PageInfo {
  pageNumber: number
  isSelected: boolean
  thumbnail?: string
}

export default function PDFPageSelector({
  file,
  onPageSelectionChange,
  mode,
  onModeChange,
  outputFormat,
  onOutputFormatChange
}: PDFPageSelectorProps) {
  const [pages, setPages] = useState<PageInfo[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectionMode, setSelectionMode] = useState<'individual' | 'range' | 'lasso'>('individual')
  const [rangeStart, setRangeStart] = useState<number | null>(null)
  const [rangeEnd, setRangeEnd] = useState<number | null>(null)
  
  // Simulate PDF loading and page generation
  useEffect(() => {
    const simulatePDFLoading = async () => {
      setIsLoading(true)
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate mock pages (in real implementation, this would parse the actual PDF)
      const mockTotalPages = Math.floor(Math.random() * 20) + 5 // 5-25 pages
      setTotalPages(mockTotalPages)
      
      const mockPages: PageInfo[] = Array.from({ length: mockTotalPages }, (_, i) => ({
        pageNumber: i + 1,
        isSelected: false,
        thumbnail: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160" viewBox="0 0 120 160"><rect width="120" height="160" fill="%23f3f4f6" stroke="%23d1d5db" stroke-width="1"/><text x="60" y="80" text-anchor="middle" font-family="Arial" font-size="14" fill="%236b7280">Page ${i + 1}</text></svg>`
      }))
      
      setPages(mockPages)
      setIsLoading(false)
    }
    
    simulatePDFLoading()
  }, [file])

  const handlePageToggle = (pageNumber: number) => {
    const updatedPages = pages.map(page => 
      page.pageNumber === pageNumber 
        ? { ...page, isSelected: !page.isSelected }
        : page
    )
    setPages(updatedPages)
    
    const selectedPages = updatedPages
      .filter(page => page.isSelected)
      .map(page => page.pageNumber)
    onPageSelectionChange(selectedPages)
  }

  const handleSelectAll = () => {
    const updatedPages = pages.map(page => ({ ...page, isSelected: true }))
    setPages(updatedPages)
    onPageSelectionChange(pages.map(page => page.pageNumber))
  }

  const handleSelectNone = () => {
    const updatedPages = pages.map(page => ({ ...page, isSelected: false }))
    setPages(updatedPages)
    onPageSelectionChange([])
  }

  const handleRangeSelect = (start: number, end: number) => {
    const updatedPages = pages.map(page => ({
      ...page,
      isSelected: page.pageNumber >= start && page.pageNumber <= end
    }))
    setPages(updatedPages)
    
    const selectedPages = updatedPages
      .filter(page => page.isSelected)
      .map(page => page.pageNumber)
    onPageSelectionChange(selectedPages)
  }

  const handleQuickSelect = (type: 'odd' | 'even' | 'first-half' | 'last-half') => {
    let selectedPageNumbers: number[] = []
    
    switch (type) {
      case 'odd':
        selectedPageNumbers = pages.filter(page => page.pageNumber % 2 === 1).map(page => page.pageNumber)
        break
      case 'even':
        selectedPageNumbers = pages.filter(page => page.pageNumber % 2 === 0).map(page => page.pageNumber)
        break
      case 'first-half':
        const half = Math.ceil(totalPages / 2)
        selectedPageNumbers = pages.filter(page => page.pageNumber <= half).map(page => page.pageNumber)
        break
      case 'last-half':
        const half2 = Math.ceil(totalPages / 2)
        selectedPageNumbers = pages.filter(page => page.pageNumber > half2).map(page => page.pageNumber)
        break
    }
    
    const updatedPages = pages.map(page => ({
      ...page,
      isSelected: selectedPageNumbers.includes(page.pageNumber)
    }))
    setPages(updatedPages)
    onPageSelectionChange(selectedPageNumbers)
  }

  const selectedPages = pages.filter(page => page.isSelected)
  const selectedCount = selectedPages.length

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Operation Mode</h3>
        
        <div className="flex space-x-4">
          <button
            onClick={() => onModeChange('extract')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
              mode === 'extract'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground hover:border-primary/30'
            }`}
          >
            <Scissors className="h-4 w-4" />
            <span>Extract Pages</span>
          </button>
          
          <button
            onClick={() => onModeChange('delete')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
              mode === 'delete'
                ? 'border-red-500 bg-red-500/10 text-red-600'
                : 'border-border bg-background text-muted-foreground hover:border-red-500/30'
            }`}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Pages</span>
          </button>
        </div>
      </div>

      {/* Output Format */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Output Format</h3>
        
        <div className="flex space-x-4">
          <button
            onClick={() => onOutputFormatChange('pdf')}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              outputFormat === 'pdf'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground hover:border-primary/30'
            }`}
          >
            PDF Document
          </button>
          
          <button
            onClick={() => onOutputFormatChange('images')}
            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
              outputFormat === 'images'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground hover:border-primary/30'
            }`}
          >
            Image Files
          </button>
        </div>
      </div>

      {/* Quick Selection Tools */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Selection</h3>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSelectAll}
            className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
          >
            Select All ({totalPages})
          </button>
          
          <button
            onClick={handleSelectNone}
            className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
          >
            Select None
          </button>
          
          <button
            onClick={() => handleQuickSelect('odd')}
            className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
          >
            Odd Pages
          </button>
          
          <button
            onClick={() => handleQuickSelect('even')}
            className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
          >
            Even Pages
          </button>
          
          <button
            onClick={() => handleQuickSelect('first-half')}
            className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
          >
            First Half
          </button>
          
          <button
            onClick={() => handleQuickSelect('last-half')}
            className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
          >
            Last Half
          </button>
        </div>
      </div>

      {/* Page Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Page Selection ({selectedCount} of {totalPages} selected)
          </h3>
          
          {selectedCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {mode === 'extract' ? 'Will extract' : 'Will delete'} {selectedCount} page{selectedCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {pages.map((page) => (
            <motion.div
              key={page.pageNumber}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group cursor-pointer"
              onClick={() => handlePageToggle(page.pageNumber)}
            >
              {/* Page Thumbnail */}
              <div className={`relative border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                page.isSelected
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : 'border-border hover:border-primary/30'
              }`}>
                {/* Thumbnail Image */}
                <img
                  src={page.thumbnail}
                  alt={`Page ${page.pageNumber}`}
                  className="w-full h-32 object-cover"
                />
                
                {/* Selection Overlay */}
                {page.isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </motion.div>
                )}
                
                {/* Page Number */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 px-2 text-center">
                  Page {page.pageNumber}
                </div>
                
                {/* Checkbox */}
                <div className="absolute top-2 right-2">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    page.isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  }`}>
                    {page.isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selection Summary */}
      {selectedCount > 0 && (
        <div className="card p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">
                {mode === 'extract' ? 'Pages to Extract' : 'Pages to Delete'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedPages.map(p => p.pageNumber).join(', ')}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{selectedCount}</div>
              <div className="text-sm text-muted-foreground">pages</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
