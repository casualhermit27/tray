import * as XLSX from 'xlsx'

export interface ExcelToCSVOptions {
  'sheet-selection': 'first' | 'all' | 'custom'
  'delimiter': 'comma' | 'tab' | 'semicolon'
  'formula-mode': 'formulas' | 'values'
  customSheetName?: string
}

export interface CSVToExcelOptions {
  'auto-detect-delimiter': boolean
  'encoding': 'utf-8' | 'iso-8859-1'
  'single-sheet': boolean
}

export interface ConversionResult {
  success: boolean
  convertedData?: string | Uint8Array
  convertedFiles?: { name: string; data: string | Uint8Array }[] // For multiple sheets
  error?: string
  originalSize: number
  finalSize: number
  sheetCount?: number
  rowCount?: number
  metadata?: {
    sheetsProcessed: string[]
    delimiter: string
    encoding: string
    formulasPreserved?: boolean
  }
}

export async function excelToCSV(
  file: File,
  options: ExcelToCSVOptions
): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { 
      type: 'array',
      cellFormula: options['formula-mode'] === 'formulas'
    })
    
    const sheetNames = workbook.SheetNames
    const delimiter = getDelimiterChar(options.delimiter)
    
    // Handle different sheet selection modes
    if (options['sheet-selection'] === 'all') {
      return await convertAllSheets(workbook, file, delimiter, options)
    } else if (options['sheet-selection'] === 'custom' && options.customSheetName) {
      return await convertSingleSheet(workbook, file, options.customSheetName, delimiter, options)
    } else {
      // First sheet
      return await convertSingleSheet(workbook, file, sheetNames[0], delimiter, options)
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Excel to CSV conversion failed',
      originalSize: file.size,
      finalSize: 0
    }
  }
}

async function convertSingleSheet(
  workbook: XLSX.WorkBook, 
  file: File, 
  sheetName: string, 
  delimiter: string,
  options: ExcelToCSVOptions
): Promise<ConversionResult> {
  if (!workbook.SheetNames.includes(sheetName)) {
    return {
      success: false,
      error: `Sheet "${sheetName}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`,
      originalSize: file.size,
      finalSize: 0
    }
  }
  
  const worksheet = workbook.Sheets[sheetName]
  const csvContent = XLSX.utils.sheet_to_csv(worksheet, {
    FS: delimiter,
    rawNumbers: options['formula-mode'] === 'values'
  })
  
  return {
    success: true,
    convertedData: csvContent,
    originalSize: file.size,
    finalSize: csvContent.length,
    sheetCount: workbook.SheetNames.length,
    rowCount: XLSX.utils.sheet_to_json(worksheet).length,
    metadata: {
      sheetsProcessed: [sheetName],
      delimiter: options.delimiter,
      encoding: 'utf-8',
      formulasPreserved: options['formula-mode'] === 'formulas'
    }
  }
}

async function convertAllSheets(
  workbook: XLSX.WorkBook, 
  file: File, 
  delimiter: string,
  options: ExcelToCSVOptions
): Promise<ConversionResult> {
  const convertedFiles: { name: string; data: string }[] = []
  let totalRowCount = 0
  let totalSize = 0
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    const csvContent = XLSX.utils.sheet_to_csv(worksheet, {
      FS: delimiter,
      rawNumbers: options['formula-mode'] === 'values'
    })
    
    convertedFiles.push({
      name: `${sheetName}.csv`,
      data: csvContent
    })
    
    totalRowCount += XLSX.utils.sheet_to_json(worksheet).length
    totalSize += csvContent.length
  }
  
  return {
    success: true,
    convertedData: convertedFiles[0].data, // Return first sheet as main data
    convertedFiles,
    originalSize: file.size,
    finalSize: totalSize,
    sheetCount: workbook.SheetNames.length,
    rowCount: totalRowCount,
    metadata: {
      sheetsProcessed: workbook.SheetNames,
      delimiter: options.delimiter,
      encoding: 'utf-8',
      formulasPreserved: options['formula-mode'] === 'formulas'
    }
  }
}

function getDelimiterChar(delimiter: 'comma' | 'tab' | 'semicolon'): string {
  switch (delimiter) {
    case 'comma': return ','
    case 'tab': return '\t'
    case 'semicolon': return ';'
    default: return ','
  }
}

export async function csvToExcel(
  file: File,
  options: CSVToExcelOptions
): Promise<ConversionResult> {
  try {
    let text = await file.text()
    
    // Handle encoding if not UTF-8
    if (options.encoding === 'iso-8859-1') {
      // In a real implementation, you'd use proper encoding detection/conversion
      text = text // Simulated - would actually convert encoding
    }
    
    // Auto-detect delimiter if enabled
    let delimiter = ','
    if (options['auto-detect-delimiter']) {
      delimiter = detectDelimiter(text)
    }
    
    // Parse CSV content
    const workbook = XLSX.read(text, {
      type: 'string',
      FS: delimiter
    })
    
    // Handle single sheet mode
    if (options['single-sheet'] && workbook.SheetNames.length > 1) {
      // Combine all sheets into one
      const combinedWorkbook = combineSheets(workbook)
      const excelBuffer = XLSX.write(combinedWorkbook, {
        type: 'array',
        bookType: 'xlsx'
      })
      
      return {
        success: true,
        convertedData: new Uint8Array(excelBuffer),
        originalSize: file.size,
        finalSize: excelBuffer.byteLength,
        sheetCount: 1,
        rowCount: getTotalRowCount(combinedWorkbook),
        metadata: {
          sheetsProcessed: workbook.SheetNames,
          delimiter: getDelimiterName(delimiter),
          encoding: options.encoding
        }
      }
    }
    
    // Convert to Excel format
    const excelBuffer = XLSX.write(workbook, {
      type: 'array',
      bookType: 'xlsx'
    })
    
    return {
      success: true,
      convertedData: new Uint8Array(excelBuffer),
      originalSize: file.size,
      finalSize: excelBuffer.byteLength,
      sheetCount: workbook.SheetNames.length,
      rowCount: getTotalRowCount(workbook),
      metadata: {
        sheetsProcessed: workbook.SheetNames,
        delimiter: getDelimiterName(delimiter),
        encoding: options.encoding
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'CSV to Excel conversion failed',
      originalSize: file.size,
      finalSize: 0
    }
  }
}

function detectDelimiter(text: string): string {
  const lines = text.split('\n').slice(0, 5) // Check first 5 lines
  const delimiters = [',', ';', '\t']
  const counts = delimiters.map(delim => 
    lines.reduce((count, line) => count + (line.split(delim).length - 1), 0)
  )
  
  const maxIndex = counts.indexOf(Math.max(...counts))
  return delimiters[maxIndex]
}

function combineSheets(workbook: XLSX.WorkBook): XLSX.WorkBook {
  const newWorkbook = XLSX.utils.book_new()
  const combinedData: any[] = []
  
  // Combine all sheets into a single array
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    // Add sheet separator
    if (combinedData.length > 0) {
      combinedData.push([]) // Empty row
      combinedData.push([`--- ${sheetName} ---`]) // Sheet header
    }
    
    combinedData.push(...sheetData)
  }
  
  const newWorksheet = XLSX.utils.aoa_to_sheet(combinedData)
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Combined')
  
  return newWorkbook
}

function getTotalRowCount(workbook: XLSX.WorkBook): number {
  return workbook.SheetNames.reduce((total, sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    return total + XLSX.utils.sheet_to_json(sheet).length
  }, 0)
}

function getDelimiterName(delimiter: string): string {
  switch (delimiter) {
    case ',': return 'comma'
    case '\t': return 'tab'
    case ';': return 'semicolon'
    default: return 'comma'
  }
}
