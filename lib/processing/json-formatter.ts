export interface JSONFormatOptions {
  'format-mode': 'beautify' | 'minify'
  'error-highlighting': boolean
  'convert-to-csv': boolean
}

export interface JSONFormatResult {
  success: boolean
  formattedJson?: string
  csvData?: string
  error?: string
  originalSize: number
  finalSize: number
  isValid: boolean
  validationErrors?: string[]
  metadata?: {
    formatMode: string
    objectCount: number
    arrayCount: number
    propertyCount: number
    depth: number
    dataTypes: Record<string, number>
  }
}

export async function formatJSON(
  file: File,
  options: JSONFormatOptions
): Promise<JSONFormatResult> {
  try {
    const text = await file.text()
    
    // Parse JSON to validate
    let parsedJson: any
    let validationErrors: string[] = []
    
    try {
      parsedJson = JSON.parse(text)
    } catch (parseError) {
      if (options['error-highlighting']) {
        validationErrors.push(`Parse Error: ${parseError instanceof Error ? parseError.message : 'Invalid JSON syntax'}`)
      }
      
      return {
        success: false,
        error: `Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Parse error'}`,
        originalSize: file.size,
        finalSize: 0,
        isValid: false,
        validationErrors
      }
    }
    
    // Analyze JSON structure
    const analysis = analyzeJSON(parsedJson)
    const metadata = {
      ...analysis,
      formatMode: options['format-mode']
    }
    
    // Advanced validation with error highlighting
    if (options['error-highlighting']) {
      validationErrors = validateJSONAdvanced(parsedJson)
    }
    
    // Format JSON based on mode
    let formattedJson: string
    if (options['format-mode'] === 'minify') {
      formattedJson = JSON.stringify(parsedJson)
    } else {
      formattedJson = JSON.stringify(parsedJson, null, 2)
    }
    
    // Convert to CSV if requested
    let csvData: string | undefined
    if (options['convert-to-csv']) {
      csvData = convertJSONToCSV(parsedJson)
    }
    
    return {
      success: true,
      formattedJson,
      csvData,
      originalSize: file.size,
      finalSize: formattedJson.length,
      isValid: validationErrors.length === 0,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      metadata
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'JSON formatting failed',
      originalSize: file.size,
      finalSize: 0,
      isValid: false
    }
  }
}

function analyzeJSON(json: any, depth = 0): {
  objectCount: number
  arrayCount: number
  propertyCount: number
  depth: number
  dataTypes: Record<string, number>
} {
  const analysis = {
    objectCount: 0,
    arrayCount: 0,
    propertyCount: 0,
    depth: depth,
    dataTypes: {} as Record<string, number>
  }
  
  const type = Array.isArray(json) ? 'array' : typeof json
  analysis.dataTypes[type] = (analysis.dataTypes[type] || 0) + 1
  
  if (Array.isArray(json)) {
    analysis.arrayCount = 1
    for (const item of json) {
      const subAnalysis = analyzeJSON(item, depth + 1)
      analysis.objectCount += subAnalysis.objectCount
      analysis.arrayCount += subAnalysis.arrayCount
      analysis.propertyCount += subAnalysis.propertyCount
      analysis.depth = Math.max(analysis.depth, subAnalysis.depth)
      
      // Merge data types
      Object.keys(subAnalysis.dataTypes).forEach(key => {
        analysis.dataTypes[key] = (analysis.dataTypes[key] || 0) + subAnalysis.dataTypes[key]
      })
    }
  } else if (typeof json === 'object' && json !== null) {
    analysis.objectCount = 1
    const keys = Object.keys(json)
    analysis.propertyCount = keys.length
    
    for (const key of keys) {
      const subAnalysis = analyzeJSON(json[key], depth + 1)
      analysis.objectCount += subAnalysis.objectCount
      analysis.arrayCount += subAnalysis.arrayCount
      analysis.propertyCount += subAnalysis.propertyCount
      analysis.depth = Math.max(analysis.depth, subAnalysis.depth)
      
      // Merge data types
      Object.keys(subAnalysis.dataTypes).forEach(key => {
        analysis.dataTypes[key] = (analysis.dataTypes[key] || 0) + subAnalysis.dataTypes[key]
      })
    }
  }
  
  return analysis
}

function validateJSONAdvanced(json: any, path = 'root'): string[] {
  const errors: string[] = []
  
  // Check for potential issues
  if (json === null) {
    errors.push(`${path}: Contains null value`)
  }
  
  if (typeof json === 'number' && !isFinite(json)) {
    errors.push(`${path}: Contains non-finite number (${json})`)
  }
  
  if (typeof json === 'string' && json.length === 0) {
    errors.push(`${path}: Contains empty string`)
  }
  
  // Check for suspicious patterns
  if (typeof json === 'string' && json.includes('</script>')) {
    errors.push(`${path}: Contains potentially unsafe script content`)
  }
  
  // Recursively validate nested structures
  if (Array.isArray(json)) {
    json.forEach((item, index) => {
      const nestedErrors = validateJSONAdvanced(item, `${path}[${index}]`)
      errors.push(...nestedErrors)
    })
    
    // Check for array-specific issues
    if (json.length === 0) {
      errors.push(`${path}: Empty array`)
    }
  } else if (typeof json === 'object' && json !== null) {
    Object.keys(json).forEach(key => {
      const nestedErrors = validateJSONAdvanced(json[key], `${path}.${key}`)
      errors.push(...nestedErrors)
    })
    
    // Check for object-specific issues
    if (Object.keys(json).length === 0) {
      errors.push(`${path}: Empty object`)
    }
    
    // Check for suspicious key names
    Object.keys(json).forEach(key => {
      if (key.includes(' ')) {
        errors.push(`${path}: Key "${key}" contains spaces`)
      }
      if (key.startsWith('_')) {
        errors.push(`${path}: Key "${key}" starts with underscore (may be private)`)
      }
    })
  }
  
  return errors
}

function convertJSONToCSV(json: any): string {
  if (!Array.isArray(json)) {
    // Convert single object to array
    json = [json]
  }
  
  if (json.length === 0) {
    return ''
  }
  
  // Get all unique keys from all objects
  const allKeys = new Set<string>()
  json.forEach((item: any) => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => allKeys.add(key))
    }
  })
  
  const keys = Array.from(allKeys)
  const csvLines: string[] = []
  
  // Add header
  csvLines.push(keys.join(','))
  
  // Add data rows
  json.forEach((item: any) => {
    const row = keys.map(key => {
      const value = item && typeof item === 'object' ? item[key] : ''
      // Escape CSV values
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value || ''
    })
    csvLines.push(row.join(','))
  })
  
  return csvLines.join('\n')
}


