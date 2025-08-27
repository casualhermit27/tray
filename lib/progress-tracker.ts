export interface ProgressUpdate {
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  message?: string
  stage?: string
  metadata?: Record<string, any>
}

export interface ProgressCallback {
  (update: ProgressUpdate): void
}

export class ProgressTracker {
  private progress: number = 0
  private status: ProgressUpdate['status'] = 'pending'
  private message: string = ''
  private stage: string = ''
  private metadata: Record<string, any> = {}
  private callbacks: ProgressCallback[] = []
  private startTime: number = 0
  private stages: string[] = []
  private currentStageIndex: number = 0

  constructor(stages: string[] = []) {
    this.stages = stages
    this.startTime = Date.now()
  }

  addCallback(callback: ProgressCallback) {
    this.callbacks.push(callback)
  }

  removeCallback(callback: ProgressCallback) {
    const index = this.callbacks.indexOf(callback)
    if (index > -1) {
      this.callbacks.splice(index, 1)
    }
  }

  private notifyCallbacks() {
    const update: ProgressUpdate = {
      progress: this.progress,
      status: this.status,
      message: this.message,
      stage: this.stage,
      metadata: this.metadata
    }
    
    this.callbacks.forEach(callback => callback(update))
  }

  setProgress(progress: number, message?: string) {
    this.progress = Math.max(0, Math.min(100, progress))
    if (message) this.message = message
    this.notifyCallbacks()
  }

  setStatus(status: ProgressUpdate['status'], message?: string) {
    this.status = status
    if (message) this.message = message
    this.notifyCallbacks()
  }

  setStage(stage: string, message?: string) {
    this.stage = stage
    if (message) this.message = message
    
    // Calculate progress based on stage
    if (this.stages.length > 0) {
      const stageIndex = this.stages.indexOf(stage)
      if (stageIndex >= 0) {
        this.currentStageIndex = stageIndex
        const stageProgress = (stageIndex / (this.stages.length - 1)) * 100
        this.progress = stageProgress
      }
    }
    
    this.notifyCallbacks()
  }

  setMetadata(metadata: Record<string, any>) {
    this.metadata = { ...this.metadata, ...metadata }
    this.notifyCallbacks()
  }

  updateMetadata(key: string, value: any) {
    this.metadata[key] = value
    this.notifyCallbacks()
  }

  nextStage(message?: string) {
    if (this.currentStageIndex < this.stages.length - 1) {
      this.currentStageIndex++
      const nextStage = this.stages[this.currentStageIndex]
      this.setStage(nextStage, message)
    }
  }

  complete(message?: string) {
    this.status = 'completed'
    this.progress = 100
    if (message) this.message = message
    this.metadata.processingTime = Date.now() - this.startTime
    this.notifyCallbacks()
  }

  error(message: string, metadata?: Record<string, any>) {
    this.status = 'error'
    if (metadata) this.metadata = { ...this.metadata, ...metadata }
    this.message = message
    this.metadata.processingTime = Date.now() - this.startTime
    this.notifyCallbacks()
  }

  getProgress(): ProgressUpdate {
    return {
      progress: this.progress,
      status: this.status,
      message: this.message,
      stage: this.stage,
      metadata: this.metadata
    }
  }

  getProcessingTime(): number {
    return Date.now() - this.startTime
  }

  reset() {
    this.progress = 0
    this.status = 'pending'
    this.message = ''
    this.stage = ''
    this.metadata = {}
    this.currentStageIndex = 0
    this.startTime = Date.now()
    this.notifyCallbacks()
  }
}

// Predefined stage configurations for different tools
export const TOOL_STAGES = {
  'pdf-merge': [
    'Validating files',
    'Loading PDFs',
    'Merging pages',
    'Optimizing output',
    'Finalizing'
  ],
  'pdf-compress': [
    'Loading PDF',
    'Analyzing content',
    'Applying compression',
    'Optimizing',
    'Finalizing'
  ],
  'pdf-extract': [
    'Loading PDF',
    'Extracting content',
    'Processing pages',
    'Formatting output',
    'Finalizing'
  ],
  'excel-to-csv': [
    'Loading Excel file',
    'Reading sheets',
    'Converting data',
    'Formatting CSV',
    'Finalizing'
  ],
  'csv-to-excel': [
    'Reading CSV file',
    'Parsing data',
    'Creating workbook',
    'Formatting sheets',
    'Finalizing'
  ],
  'json-formatter': [
    'Reading JSON',
    'Validating syntax',
    'Formatting content',
    'Applying options',
    'Finalizing'
  ],
  'image-compressor': [
    'Loading image',
    'Analyzing format',
    'Applying compression',
    'Optimizing quality',
    'Finalizing'
  ],
  'ocr-extract': [
    'Loading image',
    'Preprocessing',
    'OCR processing',
    'Text extraction',
    'Finalizing'
  ],
  'html-to-markdown': [
    'Reading HTML',
    'Parsing content',
    'Converting elements',
    'Formatting markdown',
    'Finalizing'
  ],
  'text-summarizer': [
    'Reading text',
    'Analyzing content',
    'Generating summary',
    'Optimizing output',
    'Finalizing'
  ]
}

export function createProgressTracker(toolId: string): ProgressTracker {
  const stages = TOOL_STAGES[toolId as keyof typeof TOOL_STAGES] || ['Processing']
  return new ProgressTracker(stages)
}

// Utility function to simulate progress for development/testing
export function simulateProgress(
  tracker: ProgressTracker,
  duration: number = 3000,
  interval: number = 100
): Promise<void> {
  return new Promise((resolve) => {
    const steps = duration / interval
    const increment = 100 / steps
    let currentProgress = 0
    
    const timer = setInterval(() => {
      currentProgress += increment
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(timer)
        tracker.complete('Processing completed')
        resolve()
      } else {
        tracker.setProgress(currentProgress)
      }
    }, interval)
  })
}
