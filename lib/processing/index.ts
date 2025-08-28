// PDF Processing Services
export * from './pdf-merge'
export * from './pdf-compress'
export * from './pdf-extract'
export * from './pdf-to-office'

// Data Processing Services
export * from './excel-csv'
export * from './json-formatter'
export * from './excel-cleaner'
export * from './sql-formatter'

// Image Processing Services
export * from './image-compress'
export * from './ocr-extract'
export * from './image-background-removal'

// Web Processing Services
export * from './html-markdown'
export * from './text-extraction'
export * from './screenshot-tool'

// Main processing function that routes to appropriate service
export async function processFile(
  file: File | File[],
  toolId: string,
  options: any
): Promise<any> {
  const { 
    mergePDFs, 
    compressPDF, 
    extractFromPDF,
    processPDFToOffice,
    excelToCSV,
    csvToExcel,
    formatJSON,
    cleanExcel,
    processSQLFormatter,
    compressImage,
    extractTextOCR,
    htmlToMarkdown,
    extractTextFromUrl,
    captureScreenshot,
    processBackgroundRemoval
  } = await import('./index')
  
  switch (toolId) {
    // PDF Tools
    case 'pdf-merge':
      // Handle multiple files for PDF merge
      const files = Array.isArray(file) ? file : [file]
      return await mergePDFs(files, options)
    case 'pdf-compress':
      const singleFile = Array.isArray(file) ? file[0] : file
      return await compressPDF(singleFile, options)
    case 'pdf-extract':
      const extractFile = Array.isArray(file) ? file[0] : file
      return await extractFromPDF(extractFile, options)
    case 'pdf-to-office':
      const officeFile = Array.isArray(file) ? file[0] : file
      return await processPDFToOffice([officeFile], options)
    
    // Data Tools
    case 'excel-to-csv':
      const excelFile = Array.isArray(file) ? file[0] : file
      return await excelToCSV(excelFile, options)
    case 'csv-to-excel':
      const csvFile = Array.isArray(file) ? file[0] : file
      return await csvToExcel(csvFile, options)
    case 'json-formatter':
      const jsonFile = Array.isArray(file) ? file[0] : file
      return await formatJSON(jsonFile, options)
    case 'excel-cleaner':
      const cleanFile = Array.isArray(file) ? file[0] : file
      return await cleanExcel(cleanFile, options)
    case 'sql-formatter':
      const sqlFile = Array.isArray(file) ? file[0] : file
      return await processSQLFormatter([sqlFile], options)
    
    // Media Tools
    case 'image-compression':
      if (Array.isArray(file)) {
        // Process multiple images
        const results = await Promise.all(file.map(f => compressImage(f, options)))
        return combineImageResults(results, 'compression')
      } else {
        return await compressImage(file, options)
      }
    case 'format-conversion':
      if (Array.isArray(file)) {
        // Process multiple images
        const results = await Promise.all(file.map(f => compressImage(f, { ...options, format: options.targetFormat })))
        return combineImageResults(results, 'conversion')
      } else {
        return await compressImage(file, { ...options, format: options.targetFormat })
      }
    case 'ocr-extraction':
      if (Array.isArray(file)) {
        // Process multiple images for OCR
        const results = await Promise.all(file.map(f => extractTextOCR(f, options)))
        return combineOCRResults(results)
      } else {
        return await extractTextOCR(file, options)
      }
    case 'background-removal':
      if (Array.isArray(file)) {
        // Process multiple images for background removal
        return await processBackgroundRemoval(file, options)
      } else {
        return await processBackgroundRemoval([file], options)
      }
    
    // Web Tools
    case 'html-to-markdown':
      const htmlFile = Array.isArray(file) ? file[0] : file
      return await htmlToMarkdown(htmlFile, options)
    case 'text-extraction':
      // For URL-based extraction, file would contain the URL as text
      const urlFile = Array.isArray(file) ? file[0] : file
      const url = await urlFile.text()
      return await extractTextFromUrl(url, options)
    case 'screenshot-tool':
      // For screenshot tool, file would contain the URL as text
      const screenshotFile = Array.isArray(file) ? file[0] : file
      const screenshotUrl = await screenshotFile.text()
      return await captureScreenshot(screenshotUrl, options)
    
    default:
      throw new Error(`Unknown tool: ${toolId}`)
  }
}

// Helper functions to combine results from multiple files
function combineImageResults(results: any[], operation: 'compression' | 'conversion') {
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  if (successful.length === 0) {
    return {
      success: false,
      error: `All ${operation} operations failed`,
      originalSize: results.reduce((sum, r) => sum + (r.originalSize || 0), 0),
      finalSize: 0
    }
  }
  
  const totalOriginalSize = successful.reduce((sum, r) => sum + r.originalSize, 0)
  const totalFinalSize = successful.reduce((sum, r) => sum + r.finalSize, 0)
  const avgCompressionRatio = successful.reduce((sum, r) => sum + (r.compressionRatio || 0), 0) / successful.length
  
  return {
    success: true,
    originalSize: totalOriginalSize,
    finalSize: totalFinalSize,
    compressionRatio: Math.round(avgCompressionRatio),
    filesProcessed: successful.length,
    filesFailed: failed.length,
    metadata: {
      operation,
      individualResults: successful,
      failedFiles: failed.map(f => f.error)
    }
  }
}

function combineOCRResults(results: any[]) {
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  if (successful.length === 0) {
    return {
      success: false,
      error: 'All OCR operations failed',
      originalSize: results.reduce((sum, r) => sum + (r.originalSize || 0), 0),
      finalSize: 0
    }
  }
  
  const combinedText = successful.map(r => r.extractedText || '').join('\n\n---\n\n')
  const avgConfidence = successful.reduce((sum, r) => sum + (r.confidence || 0), 0) / successful.length
  const totalWordCount = successful.reduce((sum, r) => sum + (r.wordCount || 0), 0)
  
  return {
    success: true,
    extractedText: combinedText,
    confidence: Math.round(avgConfidence),
    wordCount: totalWordCount,
    originalSize: successful.reduce((sum, r) => sum + r.originalSize, 0),
    finalSize: combinedText.length,
    filesProcessed: successful.length,
    filesFailed: failed.length,
    metadata: {
      individualResults: successful,
      failedFiles: failed.map(f => f.error)
    }
  }
}
