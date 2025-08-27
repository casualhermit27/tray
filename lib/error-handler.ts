export interface ProcessingError {
  code: string
  message: string
  details?: string
  suggestion?: string
  retryable: boolean
  timestamp: Date
  toolId?: string
  fileInfo?: {
    name: string
    size: number
    type: string
  }
}

export class ProcessingErrorHandler {
  private static errorCodes = {
    // File-related errors
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
    CORRUPTED_FILE: 'CORRUPTED_FILE',
    EMPTY_FILE: 'EMPTY_FILE',
    
    // Processing errors
    PROCESSING_FAILED: 'PROCESSING_FAILED',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    MEMORY_ERROR: 'MEMORY_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    
    // Tool-specific errors
    PDF_PARSE_ERROR: 'PDF_PARSE_ERROR',
    IMAGE_PROCESSING_ERROR: 'IMAGE_PROCESSING_ERROR',
    OCR_FAILED: 'OCR_FAILED',
    CONVERSION_FAILED: 'CONVERSION_FAILED',
    
    // System errors
    NETWORK_ERROR: 'NETWORK_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
  }

  static createError(
    code: string,
    message: string,
    details?: string,
    suggestion?: string,
    retryable: boolean = false,
    toolId?: string,
    fileInfo?: { name: string; size: number; type: string }
  ): ProcessingError {
    return {
      code,
      message,
      details,
      suggestion,
      retryable,
      timestamp: new Date(),
      toolId,
      fileInfo
    }
  }

  static handleFileError(error: any, file: File, toolId: string): ProcessingError {
    if (error.name === 'FileError') {
      return this.createError(
        this.errorCodes.FILE_TOO_LARGE,
        'File is too large to process',
        `File size: ${this.formatFileSize(file.size)}`,
        'Try compressing the file first or use a smaller file',
        false,
        toolId,
        { name: file.name, size: file.size, type: file.type }
      )
    }

    if (error.message?.includes('unsupported')) {
      return this.createError(
        this.errorCodes.UNSUPPORTED_FILE_TYPE,
        'File type not supported',
        `File type: ${file.type}`,
        'Check the supported file types for this tool',
        false,
        toolId,
        { name: file.name, size: file.size, type: file.type }
      )
    }

    return this.createError(
      this.errorCodes.UNKNOWN_ERROR,
      'Unknown file error occurred',
      error.message || 'No details available',
      'Try uploading the file again or contact support',
      true,
      toolId,
      { name: file.name, size: file.size, type: file.type }
    )
  }

  static handleProcessingError(error: any, toolId: string): ProcessingError {
    if (error.message?.includes('timeout')) {
      return this.createError(
        this.errorCodes.TIMEOUT_ERROR,
        'Processing timed out',
        'The operation took too long to complete',
        'Try with a smaller file or try again later',
        true,
        toolId
      )
    }

    if (error.message?.includes('memory')) {
      return this.createError(
        this.errorCodes.MEMORY_ERROR,
        'Insufficient memory',
        'The file is too large to process with available memory',
        'Try with a smaller file or split the file into parts',
        false,
        toolId
      )
    }

    if (error.message?.includes('validation')) {
      return this.createError(
        this.errorCodes.VALIDATION_ERROR,
        'Validation failed',
        error.message,
        'Check the file format and try again',
        false,
        toolId
      )
    }

    return this.createError(
      this.errorCodes.PROCESSING_FAILED,
      'Processing failed',
      error.message || 'No details available',
      'Try again or contact support if the problem persists',
      true,
      toolId
    )
  }

  static handleToolSpecificError(error: any, toolId: string): ProcessingError {
    switch (toolId) {
      case 'pdf-merge':
      case 'pdf-compress':
      case 'pdf-extract':
        if (error.message?.includes('PDF')) {
          return this.createError(
            this.errorCodes.PDF_PARSE_ERROR,
            'PDF parsing failed',
            error.message,
            'The PDF file may be corrupted or password-protected',
            false,
            toolId
          )
        }
        break

      case 'image-compressor':
      case 'image-converter':
      case 'ocr-extract':
        if (error.message?.includes('image')) {
          return this.createError(
            this.errorCodes.IMAGE_PROCESSING_ERROR,
            'Image processing failed',
            error.message,
            'The image file may be corrupted or in an unsupported format',
            false,
            toolId
          )
        }
        break

      case 'ocr-extract':
        if (error.message?.includes('OCR')) {
          return this.createError(
            this.errorCodes.OCR_FAILED,
            'OCR processing failed',
            error.message,
            'The image quality may be too low for text extraction',
            true,
            toolId
          )
        }
        break

      case 'excel-to-csv':
      case 'csv-to-excel':
        if (error.message?.includes('convert')) {
          return this.createError(
            this.errorCodes.CONVERSION_FAILED,
            'File conversion failed',
            error.message,
            'The file format may be corrupted or unsupported',
            false,
            toolId
          )
        }
        break
    }

    return this.createError(
      this.errorCodes.PROCESSING_FAILED,
      'Tool-specific processing failed',
      error.message || 'No details available',
      'Try with a different file or contact support',
      true,
      toolId
    )
  }

  static getErrorMessage(error: ProcessingError): string {
    let message = error.message

    if (error.details) {
      message += `\n\nDetails: ${error.details}`
    }

    if (error.suggestion) {
      message += `\n\nSuggestion: ${error.suggestion}`
    }

    return message
  }

  static getErrorDisplayInfo(error: ProcessingError) {
    const isRetryable = error.retryable
    const severity = this.getErrorSeverity(error.code)
    
    return {
      isRetryable,
      severity,
      displayMessage: this.getErrorMessage(error),
      canRetry: isRetryable && error.code !== this.errorCodes.UNSUPPORTED_FILE_TYPE,
      showDetails: error.details !== undefined,
      showSuggestion: error.suggestion !== undefined
    }
  }

  private static getErrorSeverity(code: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (code) {
      case this.errorCodes.FILE_TOO_LARGE:
      case this.errorCodes.UNSUPPORTED_FILE_TYPE:
        return 'medium'
      
      case this.errorCodes.CORRUPTED_FILE:
      case this.errorCodes.VALIDATION_ERROR:
        return 'high'
      
      case this.errorCodes.MEMORY_ERROR:
      case this.errorCodes.SERVER_ERROR:
        return 'critical'
      
      default:
        return 'medium'
    }
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static isRetryableError(error: ProcessingError): boolean {
    return error.retryable && error.code !== this.errorCodes.UNSUPPORTED_FILE_TYPE
  }

  static getRetryDelay(error: ProcessingError): number {
    // Return delay in milliseconds based on error type
    switch (error.code) {
      case this.errorCodes.TIMEOUT_ERROR:
        return 5000 // 5 seconds
      case this.errorCodes.NETWORK_ERROR:
        return 3000 // 3 seconds
      case this.errorCodes.SERVER_ERROR:
        return 10000 // 10 seconds
      default:
        return 2000 // 2 seconds
    }
  }

  static getErrorCode(): typeof this.errorCodes {
    return this.errorCodes
  }
}

// Utility function to create user-friendly error messages
export function createUserFriendlyError(error: any, context?: string): string {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    let message = error.message

    // Make error messages more user-friendly
    message = message.replace(/^Error:?\s*/i, '')
    message = message.replace(/failed/i, 'could not be completed')
    message = message.replace(/invalid/i, 'not supported')
    message = message.replace(/corrupted/i, 'damaged or incomplete')

    return message
  }

  if (error && typeof error === 'object' && error.message) {
    return error.message
  }

  return context ? `${context} failed` : 'An error occurred'
}

// Error boundary component props
export interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: ProcessingError; resetError: () => void }>
  onError?: (error: ProcessingError) => void
  children: React.ReactNode
}

// Error recovery strategies
export interface ErrorRecoveryStrategy {
  canRecover: boolean
  action: string
  description: string
  handler: () => void
}

export function getErrorRecoveryStrategies(error: ProcessingError): ErrorRecoveryStrategy[] {
  const strategies: ErrorRecoveryStrategy[] = []

  if (ProcessingErrorHandler.isRetryableError(error)) {
    strategies.push({
      canRecover: true,
      action: 'Retry',
      description: 'Try processing the file again',
      handler: () => {
        // This would be implemented by the component
        console.log('Retry processing')
      }
    })
  }

  if (error.code === ProcessingErrorHandler.getErrorCode().FILE_TOO_LARGE) {
    strategies.push({
      canRecover: true,
      action: 'Compress File',
      description: 'Reduce file size before processing',
      handler: () => {
        console.log('Navigate to file compression tool')
      }
    })
  }

  if (error.code === ProcessingErrorHandler.getErrorCode().UNSUPPORTED_FILE_TYPE) {
    strategies.push({
      canRecover: true,
      action: 'Convert Format',
      description: 'Convert to a supported format first',
      handler: () => {
        console.log('Navigate to format conversion tool')
      }
    })
  }

  return strategies
}
