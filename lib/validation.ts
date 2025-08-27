export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface FileValidationOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  maxFiles?: number
}

export const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
export const DEFAULT_MAX_FILES = 10

export function validateFile(file: File, options: FileValidationOptions = {}): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  const maxSize = options.maxSize || DEFAULT_MAX_FILE_SIZE
  const allowedTypes = options.allowedTypes
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`)
  }
  
  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    const isTypeAllowed = allowedTypes.some(type => {
      if (type.includes('*')) {
        // Handle wildcard types like 'image/*'
        const baseType = type.split('/')[0]
        return fileType.startsWith(baseType + '/')
      }
      return fileType === type
    })
    
    if (!isTypeAllowed) {
      errors.push(`File type '${fileType}' is not supported. Allowed types: ${allowedTypes.join(', ')}`)
    }
  }
  
  // Check for empty files
  if (file.size === 0) {
    errors.push('File is empty')
  }
  
  // Check for suspicious file names
  if (file.name.includes('..') || file.name.includes('\\') || file.name.includes('/')) {
    warnings.push('File name contains potentially unsafe characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateFiles(files: File[], options: FileValidationOptions = {}): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  const maxFiles = options.maxFiles || DEFAULT_MAX_FILES
  
  // Check number of files
  if (files.length > maxFiles) {
    errors.push(`Too many files. Maximum allowed: ${maxFiles}, provided: ${files.length}`)
  }
  
  // Validate each file
  files.forEach((file, index) => {
    const fileValidation = validateFile(file, options)
    if (!fileValidation.isValid) {
      errors.push(`File ${index + 1} (${file.name}): ${fileValidation.errors.join(', ')}`)
    }
    warnings.push(...fileValidation.warnings.map(w => `File ${index + 1}: ${w}`))
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateToolOptions(toolId: string, options: Record<string, any>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  switch (toolId) {
    case 'pdf-merge':
      if (options.mergeOrder && !['name', 'date', 'custom'].includes(options.mergeOrder)) {
        errors.push('Invalid merge order specified')
      }
      if (options.mergeOrder === 'custom' && (!options.customOrder || !Array.isArray(options.customOrder))) {
        errors.push('Custom order must be an array of indices')
      }
      break
      
    case 'pdf-compress':
      if (options.compressionLevel && !['low', 'medium', 'high'].includes(options.compressionLevel)) {
        errors.push('Invalid compression level specified')
      }
      break
      
    case 'image-compressor':
      if (options.quality && (options.quality < 1 || options.quality > 100)) {
        errors.push('Quality must be between 1 and 100')
      }
      if (options.format && !['jpeg', 'png', 'webp', 'avif'].includes(options.format)) {
        errors.push('Invalid output format specified')
      }
      break
      
    case 'excel-to-csv':
    case 'csv-to-excel':
      if (options.delimiter && ![',', ';', '\t'].includes(options.delimiter)) {
        errors.push('Invalid delimiter specified')
      }
      break
      
    case 'json-formatter':
      if (options.indentation && !['2', '4', 'tab'].includes(options.indentation)) {
        errors.push('Invalid indentation specified')
      }
      break
      
    case 'ocr-extract':
      if (options.language && !['eng', 'fra', 'deu', 'spa'].includes(options.language)) {
        errors.push('Invalid language specified')
      }
      if (options.confidence && (options.confidence < 0 || options.confidence > 100)) {
        errors.push('Confidence must be between 0 and 100')
      }
      break
      
    case 'html-to-markdown':
      if (options.headingStyle && !['atx', 'setext'].includes(options.headingStyle)) {
        errors.push('Invalid heading style specified')
      }
      if (options.codeBlockStyle && !['fenced', 'indented'].includes(options.codeBlockStyle)) {
        errors.push('Invalid code block style specified')
      }
      break
      
    case 'text-summarizer':
      if (options.summaryLength && !['short', 'medium', 'long'].includes(options.summaryLength)) {
        errors.push('Invalid summary length specified')
      }
      if (options.language && !['en', 'fr', 'de', 'es'].includes(options.language)) {
        errors.push('Invalid language specified')
      }
      break
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateProcessingRequest(
  toolId: string, 
  files: File[], 
  options: Record<string, any>
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Validate files
  const fileValidation = validateFiles(files, getFileValidationOptions(toolId))
  if (!fileValidation.isValid) {
    errors.push(...fileValidation.errors)
  }
  warnings.push(...fileValidation.warnings)
  
  // Validate tool options
  const optionsValidation = validateToolOptions(toolId, options)
  if (!optionsValidation.isValid) {
    errors.push(...optionsValidation.errors)
  }
  warnings.push(...optionsValidation.warnings)
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

function getFileValidationOptions(toolId: string): FileValidationOptions {
  switch (toolId) {
    case 'pdf-merge':
      return {
        maxSize: 50 * 1024 * 1024, // 50MB per file
        allowedTypes: ['application/pdf'],
        maxFiles: 10
      }
    case 'pdf-compress':
    case 'pdf-extract':
      return {
        maxSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: ['application/pdf'],
        maxFiles: 1
      }
    case 'excel-to-csv':
      return {
        maxSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        maxFiles: 1
      }
    case 'csv-to-excel':
      return {
        maxSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: ['text/csv'],
        maxFiles: 1
      }
    case 'json-formatter':
      return {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['application/json'],
        maxFiles: 1
      }
    case 'image-compressor':
    case 'image-converter':
      return {
        maxSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: ['image/*'],
        maxFiles: 1
      }
    case 'ocr-extract':
      return {
        maxSize: 25 * 1024 * 1024, // 25MB
        allowedTypes: ['image/*'],
        maxFiles: 1
      }
    case 'html-to-markdown':
      return {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['text/html'],
        maxFiles: 1
      }
    case 'text-summarizer':
    case 'content-cleaner':
    case 'smart-extract':
      return {
        maxSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: ['text/plain', 'application/pdf'],
        maxFiles: 1
      }
    default:
      return {
        maxSize: DEFAULT_MAX_FILE_SIZE,
        maxFiles: DEFAULT_MAX_FILES
      }
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
