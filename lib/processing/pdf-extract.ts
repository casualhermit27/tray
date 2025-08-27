import { PDFDocument } from 'pdf-lib'

export interface PDFExtractOptions {
  'page-range'?: string
  'extract-format'?: 'pdf' | 'images'
  'delete-mode'?: boolean
}

export interface PDFExtractResult {
  success: boolean
  extractedPdf?: Uint8Array
  extractedPages?: number
  error?: string
  originalSize: number
  finalSize: number
  pageRanges?: string[]
  metadata?: {
    totalPages: number
    extractedPages: number
    format: string
  }
}

export async function extractFromPDF(
  file: File,
  options: PDFExtractOptions
): Promise<PDFExtractResult> {
  try {
    const fileBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(fileBuffer)
    const totalPages = pdf.getPageCount()
    
    // Parse page range
    const pageRange = options['page-range'] || '1-3'
    const pageIndices = parsePageRange(pageRange, totalPages)
    
    if (pageIndices.length === 0) {
      return {
        success: false,
        error: 'No valid pages found in the specified range',
        originalSize: file.size,
        finalSize: 0,
        extractedPages: 0
      }
    }
    
    // Create new PDF with extracted pages
    const extractedPdf = await PDFDocument.create()
    
    // Copy selected pages
    const pages = await extractedPdf.copyPages(pdf, pageIndices)
    pages.forEach(page => extractedPdf.addPage(page))
    
    const extractedPdfBytes = await extractedPdf.save()
    
    return {
      success: true,
      extractedPdf: extractedPdfBytes,
      extractedPages: pageIndices.length,
      originalSize: file.size,
      finalSize: extractedPdfBytes.length,
      pageRanges: [pageRange],
      metadata: {
        totalPages,
        extractedPages: pageIndices.length,
        format: options['extract-format'] || 'pdf'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF extraction failed',
      originalSize: file.size,
      finalSize: 0,
      extractedPages: 0
    }
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
