import { PDFDocument } from 'pdf-lib'

export interface PDFMergeOptions {
  'reorder-mode': 'drag' | 'name' | 'date'
  'insert-blank-pages': boolean
  'output-mode': 'single' | 'sections'
  customOrder?: number[]
  pageRanges?: string[] // e.g., ["1-3", "5", "7-10"] for each file
  removeDuplicates?: boolean
}

export interface PageInfo {
  fileIndex: number
  fileName: string
  pageNumber: number
  totalPages: number
  thumbnail?: string
}

export interface PDFMergeResult {
  success: boolean
  mergedPdf?: Uint8Array
  sections?: { name: string; data: Uint8Array; pages: number }[]
  error?: string
  originalSize: number
  finalSize: number
  pageCount: number
  pageInfos?: PageInfo[]
  metadata?: {
    filesProcessed: number
    pageRangesUsed?: string[]
    duplicatesRemoved?: boolean
  }
}

export async function mergePDFs(
  files: File[],
  options: PDFMergeOptions
): Promise<PDFMergeResult> {
  try {
    const mergedPdf = await PDFDocument.create()
    let totalPages = 0
    let totalOriginalSize = 0
    const pageInfos: PageInfo[] = []

    // Sort files based on reorder mode
    const sortedFiles = sortFiles(files, options['reorder-mode'] || 'drag', options.customOrder)

    // Handle sections output mode
    if (options['output-mode'] === 'sections') {
      return await createSectionedOutput(sortedFiles, options)
    }

    for (let fileIndex = 0; fileIndex < sortedFiles.length; fileIndex++) {
      const file = sortedFiles[fileIndex]
      const fileBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(fileBuffer)
      const pageCount = pdf.getPageCount()
      
      // Determine which pages to include
      const pageRange = options.pageRanges?.[fileIndex] || `1-${pageCount}`
      const pageIndices = parsePageRange(pageRange, pageCount)
      
      // Filter out duplicates if option is enabled
      const finalPageIndices = options.removeDuplicates 
        ? removeDuplicatePages(pageIndices)
        : pageIndices

      // Copy pages from source PDF
      const pages = await mergedPdf.copyPages(pdf, finalPageIndices)
      
      // Add pages to merged PDF
      pages.forEach((page, index) => {
        mergedPdf.addPage(page)
        totalPages++
        
        // Store page info for preview/reordering
        pageInfos.push({
          fileIndex,
          fileName: file.name,
          pageNumber: finalPageIndices[index] + 1,
          totalPages: pageCount
        })
      })

      // Insert blank page between PDFs if option is enabled
      if (options['insert-blank-pages'] && fileIndex < sortedFiles.length - 1) {
        mergedPdf.addPage()
        totalPages++
        pageInfos.push({
          fileIndex: -1,
          fileName: 'Blank Page',
          pageNumber: 0,
          totalPages: 1
        })
      }

      totalOriginalSize += file.size
    }

    const mergedPdfBytes = await mergedPdf.save()
    
    return {
      success: true,
      mergedPdf: mergedPdfBytes,
      originalSize: totalOriginalSize,
      finalSize: mergedPdfBytes.length,
      pageCount: totalPages,
      pageInfos,
      metadata: {
        filesProcessed: sortedFiles.length,
        pageRangesUsed: options.pageRanges,
        duplicatesRemoved: options.removeDuplicates
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF merge failed',
      originalSize: files.reduce((sum, file) => sum + file.size, 0),
      finalSize: 0,
      pageCount: 0
    }
  }
}

function sortFiles(files: File[], mode: 'drag' | 'name' | 'date', customOrder?: number[]): File[] {
  switch (mode) {
    case 'name':
      return [...files].sort((a, b) => a.name.localeCompare(b.name))
    case 'date':
      return [...files].sort((a, b) => a.lastModified - b.lastModified)
    case 'drag':
    default:
      if (customOrder && customOrder.length === files.length) {
        return customOrder.map(index => files[index])
      }
      return files // Keep original order
  }
}

function parsePageRange(range: string, totalPages: number): number[] {
  const pages: number[] = []
  const parts = range.split(',')
  
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()))
      const startPage = Math.max(1, Math.min(start, totalPages))
      const endPage = Math.max(startPage, Math.min(end, totalPages))
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i - 1) // Convert to 0-based index
      }
    } else {
      const pageNum = parseInt(trimmed)
      if (pageNum >= 1 && pageNum <= totalPages) {
        pages.push(pageNum - 1) // Convert to 0-based index
      }
    }
  }
  
  return pages
}

function removeDuplicatePages(pageIndices: number[]): number[] {
  return Array.from(new Set(pageIndices)).sort((a, b) => a - b)
}

async function createSectionedOutput(files: File[], options: PDFMergeOptions): Promise<PDFMergeResult> {
  // Create separate PDFs for each section
  const sections: { name: string; data: Uint8Array; pages: number }[] = []
  let totalOriginalSize = 0
  let totalPages = 0
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const fileBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer)
    const pageCount = pdf.getPageCount()
    
    const pageRange = options.pageRanges?.[i] || `1-${pageCount}`
    const pageIndices = parsePageRange(pageRange, pageCount)
    
    const sectionPdf = await PDFDocument.create()
    const pages = await sectionPdf.copyPages(pdf, pageIndices)
    pages.forEach(page => sectionPdf.addPage(page))
    
    const sectionBytes = await sectionPdf.save()
    sections.push({
      name: `${file.name.replace('.pdf', '')}_section.pdf`,
      data: sectionBytes,
      pages: pageIndices.length
    })
    
    totalOriginalSize += file.size
    totalPages += pageIndices.length
  }
  
  return {
    success: true,
    mergedPdf: sections[0].data, // Return first section as main data
    sections, // All sections for download
    originalSize: totalOriginalSize,
    finalSize: sections.reduce((sum, section) => sum + section.data.length, 0),
    pageCount: totalPages,
    metadata: {
      filesProcessed: files.length,
      pageRangesUsed: options.pageRanges,
      duplicatesRemoved: options.removeDuplicates
    }
  }
}
