import { PDFDocument, PDFPage } from 'pdf-lib'
import * as XLSX from 'xlsx'

export interface PDFToOfficeOptions {
  outputFormat: 'docx' | 'xlsx'
  extractTables: boolean
  preserveFormatting: boolean
  pageRange?: string // e.g., "1-3, 5, 7-9"
}

export async function processPDFToOffice(
  files: File[],
  options: PDFToOfficeOptions,
  progressTracker?: any
): Promise<any> {
  if (files.length === 0) {
    throw new Error('No files provided')
  }

  const file = files[0] // PDF to Office is single file
  const arrayBuffer = await file.arrayBuffer()
  
  if (progressTracker) {
    progressTracker.updateProgress('Loading PDF document...', 20)
  }

  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfDoc.getPages()
    
    if (progressTracker) {
      progressTracker.updateProgress('Extracting content...', 40)
    }

    let selectedPages = pages
    if (options.pageRange) {
      selectedPages = parsePageRange(pages, options.pageRange)
    }

    if (progressTracker) {
      progressTracker.updateProgress('Processing content...', 60)
    }

    let result: any

    if (options.outputFormat === 'xlsx') {
      result = await convertToExcel(selectedPages, options, progressTracker)
    } else {
      result = await convertToWord(selectedPages, options, progressTracker)
    }

    if (progressTracker) {
      progressTracker.updateProgress('Finalizing...', 90)
    }

    return {
      success: true,
      originalSize: file.size,
      finalSize: result.size,
      format: options.outputFormat,
      pages: selectedPages.length,
      downloadUrl: result.downloadUrl,
      metadata: {
        extractedTables: result.tables,
        textLength: result.textLength,
        preservedFormatting: options.preserveFormatting
      }
    }

  } catch (error) {
    throw new Error(`PDF conversion failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function convertToExcel(
  pages: PDFPage[],
  options: PDFToOfficeOptions,
  progressTracker?: any
): Promise<any> {
  const workbook = XLSX.utils.book_new()
  let totalText = ''
  let tables: any[] = []

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    
    if (progressTracker) {
      progressTracker.updateProgress(`Processing page ${i + 1}/${pages.length}...`, 60 + (i * 20 / pages.length))
    }

    // Extract text from page
    const text = await extractTextFromPage(page)
    totalText += text + '\n'

    // Extract tables if requested
    if (options.extractTables) {
      const pageTables = extractTablesFromText(text)
      tables.push(...pageTables.map((table, idx) => ({
        page: i + 1,
        tableIndex: idx,
        data: table
      })))
    }
  }

  // Create main text sheet
  const textSheet = XLSX.utils.aoa_to_sheet([
    ['Page', 'Content'],
    ...pages.map((_, idx) => [idx + 1, totalText.split('\n')[idx] || ''])
  ])
  XLSX.utils.book_append_sheet(workbook, textSheet, 'Extracted Text')

  // Create tables sheet if tables were found
  if (tables.length > 0) {
    const tableSheet = XLSX.utils.aoa_to_sheet([
      ['Page', 'Table', 'Data'],
      ...tables.flatMap(table => 
        table.data.map((row: any[], rowIdx: number) => [
          table.page,
          table.tableIndex + 1,
          row.join(' | ')
        ])
      )
    ])
    XLSX.utils.book_append_sheet(workbook, tableSheet, 'Extracted Tables')
  }

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  
  return {
    size: excelBuffer.length,
    downloadUrl: URL.createObjectURL(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })),
    tables: tables.length,
    textLength: totalText.length
  }
}

async function convertToWord(
  pages: PDFPage[],
  options: PDFToOfficeOptions,
  progressTracker?: any
): Promise<any> {
  let totalText = ''
  let tables: any[] = []

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    
    if (progressTracker) {
      progressTracker.updateProgress(`Processing page ${i + 1}/${pages.length}...`, 60 + (i * 20 / pages.length))
    }

    const text = await extractTextFromPage(page)
    totalText += `\n\n--- Page ${i + 1} ---\n\n${text}`

    if (options.extractTables) {
      const pageTables = extractTablesFromText(text)
      tables.push(...pageTables)
    }
  }

  // Create simple HTML-like structure for Word compatibility
  const wordContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>PDF to Word Conversion</title>
      </head>
      <body>
        <h1>PDF to Word Conversion</h1>
        <p><strong>Original PDF:</strong> ${pages.length} pages</p>
        <p><strong>Extracted Tables:</strong> ${tables.length}</p>
        <hr>
        ${totalText.split('\n').map(line => `<p>${line}</p>`).join('')}
      </body>
    </html>
  `

  const wordBlob = new Blob([wordContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  
  return {
    size: wordBlob.size,
    downloadUrl: URL.createObjectURL(wordBlob),
    tables: tables.length,
    textLength: totalText.length
  }
}

async function extractTextFromPage(page: PDFPage): Promise<string> {
  // This is a simplified text extraction
  // In production, you'd use a more sophisticated PDF text extraction library
  try {
    // Simulate text extraction - replace with actual implementation
    const text = `Sample text from page ${page.getWidth()}x${page.getHeight()}`
    return text
  } catch (error) {
    return `[Text extraction failed for this page: ${error instanceof Error ? error.message : String(error)}]`
  }
}

function extractTablesFromText(text: string): any[][] {
  // Simple table detection based on patterns
  const lines = text.split('\n')
  const tables: any[][] = []
  let currentTable: any[] = []

  for (const line of lines) {
    // Look for table-like patterns (multiple columns separated by spaces/tabs)
    if (line.trim().split(/\s+/).length > 2) {
      currentTable.push(line.trim().split(/\s+/))
    } else if (currentTable.length > 0) {
      if (currentTable.length > 1) {
        tables.push([...currentTable])
      }
      currentTable = []
    }
  }

  // Add the last table if it exists
  if (currentTable.length > 1) {
    tables.push(currentTable)
  }

  return tables
}

function parsePageRange(pages: PDFPage[], range: string): PDFPage[] {
  const selectedPages: PDFPage[] = []
  const parts = range.split(',').map(p => p.trim())

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n) - 1)
      for (let i = start; i <= end && i < pages.length; i++) {
        if (i >= 0) selectedPages.push(pages[i])
      }
    } else {
      const pageNum = parseInt(part) - 1
      if (pageNum >= 0 && pageNum < pages.length) {
        selectedPages.push(pages[pageNum])
      }
    }
  }

  return selectedPages.length > 0 ? selectedPages : pages
}
