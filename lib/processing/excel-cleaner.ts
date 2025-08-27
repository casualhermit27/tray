import * as XLSX from 'xlsx'

export interface ExcelCleanerOptions {
  'remove-duplicates'?: boolean
  'normalize-columns'?: boolean
  'fix-data-types'?: boolean
  'remove-empty-rows'?: boolean
  'trim-whitespace'?: boolean
}

export interface ExcelCleanerResult {
  success: boolean
  cleanedExcel?: Uint8Array
  error?: string
  originalSize: number
  finalSize: number
  metadata?: {
    duplicatesRemoved?: number
    emptyRowsRemoved?: number
    columnsNormalized?: string[]
    dataTypesFixed?: Record<string, string>
    originalRows: number
    finalRows: number
    originalColumns: number
    finalColumns: number
  }
}

export async function cleanExcel(
  file: File,
  options: ExcelCleanerOptions
): Promise<ExcelCleanerResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON for easier manipulation
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    let cleanedData: any[][] = [...jsonData] as any[][]
    let duplicatesRemoved = 0
    let emptyRowsRemoved = 0
    let columnsNormalized: string[] = []
    let dataTypesFixed: Record<string, string> = {}
    
    // Remove empty rows
    if (options['remove-empty-rows']) {
      const originalLength = cleanedData.length
      cleanedData = cleanedData.filter((row: any) => {
        if (Array.isArray(row)) {
          return row.some(cell => cell !== null && cell !== undefined && cell !== '')
        }
        return Object.values(row).some(value => value !== null && value !== undefined && value !== '')
      })
      emptyRowsRemoved = originalLength - cleanedData.length
    }
    
    // Remove duplicates
    if (options['remove-duplicates']) {
      const originalLength = cleanedData.length
      const seen = new Set()
      cleanedData = cleanedData.filter((row: any) => {
        const key = JSON.stringify(row)
        if (seen.has(key)) {
          duplicatesRemoved++
          return false
        }
        seen.add(key)
        return true
      })
    }
    
    // Normalize columns
    if (options['normalize-columns']) {
      if (cleanedData.length > 0) {
        const headers = cleanedData[0] as any[]
        columnsNormalized = headers.map((header: any, index: number) => {
          if (typeof header === 'string') {
            return header.trim().toLowerCase().replace(/\s+/g, '_')
          }
          return `column_${index + 1}`
        })
        cleanedData[0] = columnsNormalized
      }
    }
    
    // Fix data types
    if (options['fix-data-types']) {
      if (cleanedData.length > 1) {
        const headers = cleanedData[0] as any[]
        for (let colIndex = 0; colIndex < headers.length; colIndex++) {
          let hasNumbers = false
          let hasDates = false
          let hasText = false
          
          // Analyze column data types
          for (let rowIndex = 1; rowIndex < cleanedData.length; rowIndex++) {
            const cell = cleanedData[rowIndex][colIndex]
            if (cell !== null && cell !== undefined && cell !== '') {
              if (typeof cell === 'number') {
                hasNumbers = true
              } else if (cell instanceof Date) {
                hasDates = true
              } else if (typeof cell === 'string') {
                hasText = true
                // Check if it's a number
                if (!isNaN(Number(cell))) {
                  hasNumbers = true
                }
                // Check if it's a date
                if (!isNaN(Date.parse(cell))) {
                  hasDates = true
                }
              }
            }
          }
          
          // Determine best data type
          if (hasDates && !hasNumbers) {
            dataTypesFixed[headers[colIndex]] = 'date'
          } else if (hasNumbers && !hasText) {
            dataTypesFixed[headers[colIndex]] = 'number'
          } else {
            dataTypesFixed[headers[colIndex]] = 'text'
          }
        }
      }
    }
    
    // Trim whitespace
    if (options['trim-whitespace']) {
      cleanedData = cleanedData.map((row: any) => {
        if (Array.isArray(row)) {
          return row.map((cell: any) => {
            if (typeof cell === 'string') {
              return cell.trim()
            }
            return cell
          })
        }
        return row
      })
    }
    
    // Convert back to worksheet
    const cleanedWorksheet = XLSX.utils.json_to_sheet(cleanedData)
    const cleanedWorkbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(cleanedWorkbook, cleanedWorksheet, 'Cleaned Data')
    
    // Convert to buffer
    const cleanedBuffer = XLSX.write(cleanedWorkbook, { type: 'array' })
    const cleanedUint8Array = new Uint8Array(cleanedBuffer)
    
    return {
      success: true,
      cleanedExcel: cleanedUint8Array,
      originalSize: file.size,
      finalSize: cleanedUint8Array.length,
      metadata: {
        duplicatesRemoved,
        emptyRowsRemoved,
        columnsNormalized,
        dataTypesFixed,
        originalRows: jsonData.length,
        finalRows: cleanedData.length,
        originalColumns: jsonData.length > 0 ? (Array.isArray(jsonData[0]) ? (jsonData[0] as any[]).length : Object.keys(jsonData[0] as object).length) : 0,
        finalColumns: cleanedData.length > 0 ? cleanedData[0].length : 0
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Excel cleaning failed',
      originalSize: file.size,
      finalSize: 0
    }
  }
}
