export type PlanType = 'free' | 'pro'

export interface FeatureLimits {
  plan: PlanType
  maxFileSize: number // in bytes
  maxFilesPerTask: number
  maxTasksPerHour: number
  maxPagesPerTask?: number // for PDF tools
  watermark?: boolean
  batchProcessing: boolean
  priorityQueue: boolean
  advancedFeatures: boolean
}

export interface ToolLimits {
  toolId: string
  toolName: string
  free: FeatureLimits
  pro: FeatureLimits
}

// Universal feature limits
const UNIVERSAL_LIMITS = {
  free: {
    plan: 'free' as const,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    maxFilesPerTask: 1,
    maxTasksPerHour: 3,
    batchProcessing: false,
    priorityQueue: false,
    advancedFeatures: false,
    watermark: true
  },
  pro: {
    plan: 'pro' as const,
    maxFileSize: 100 * 1024 * 1024, // 100 MB
    maxFilesPerTask: 10,
    maxTasksPerHour: -1, // unlimited
    batchProcessing: true,
    priorityQueue: true,
    advancedFeatures: true,
    watermark: false
  }
}

// Tool-specific feature limits
export const TOOL_LIMITS: Record<string, ToolLimits> = {
  // PDF Tools
  'pdf-merge': {
    toolId: 'pdf-merge',
    toolName: 'PDF Merge',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFilesPerTask: 2, // Free: max 2 files
      maxPagesPerTask: 50
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFilesPerTask: 10, // Pro: unlimited files (batch up to 10)
      maxPagesPerTask: -1 // unlimited
    }
  },

  'pdf-compress': {
    toolId: 'pdf-compress',
    toolName: 'PDF Compress',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxPagesPerTask: 50
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxPagesPerTask: -1
    }
  },

  'pdf-extract': {
    toolId: 'pdf-extract',
    toolName: 'PDF Extract',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxPagesPerTask: 3, // Free: only extract 1 page at a time
      advancedFeatures: false // No range splitting
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxPagesPerTask: -1, // Pro: full split modes
      advancedFeatures: true // Range splitting, multiple ranges
    }
  },

  'pdf-to-office': {
    toolId: 'pdf-to-office',
    toolName: 'PDF to Office',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxPagesPerTask: 10,
      advancedFeatures: false // Text-only output
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxPagesPerTask: -1,
      advancedFeatures: true // Retains formatting + images
    }
  },

  // Data Tools
  'excel-to-csv': {
    toolId: 'excel-to-csv',
    toolName: 'Excel to CSV',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxPagesPerTask: 3 // Limited sheets
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxPagesPerTask: -1 // All sheets
    }
  },

  'csv-to-excel': {
    toolId: 'csv-to-excel',
    toolName: 'CSV to Excel',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxPagesPerTask: 1 // Single sheet only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxPagesPerTask: -1 // Multiple sheets
    }
  },

  'json-formatter': {
    toolId: 'json-formatter',
    toolName: 'JSON Formatter',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 1 * 1024 * 1024, // 1 MB for JSON
      advancedFeatures: false // Basic formatting only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFileSize: 10 * 1024 * 1024, // 10 MB for JSON
      advancedFeatures: true // Advanced validation, conversion
    }
  },

  'excel-cleaner': {
    toolId: 'excel-cleaner',
    toolName: 'Excel Cleaner',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxPagesPerTask: 1,
      advancedFeatures: false // Basic cleaning only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxPagesPerTask: -1,
      advancedFeatures: true // Advanced cleaning, data validation
    }
  },

  // Media Tools
  'image-compression': {
    toolId: 'image-compression',
    toolName: 'Image Compression',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFilesPerTask: 1,
      advancedFeatures: false // Basic compression only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFilesPerTask: 5, // Batch up to 5 images
      advancedFeatures: true // Multiple compression modes
    }
  },

  'format-conversion': {
    toolId: 'format-conversion',
    toolName: 'Format Conversion',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFilesPerTask: 1,
      advancedFeatures: false // Basic conversion only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFilesPerTask: 5,
      advancedFeatures: true // Background removal, resizing
    }
  },

  'ocr-extraction': {
    toolId: 'ocr-extraction',
    toolName: 'OCR Extraction',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxPagesPerTask: 5, // Free: 5 pages max
      advancedFeatures: false // Basic OCR only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxPagesPerTask: -1, // Pro: unlimited
      advancedFeatures: true // Multiple languages, batch
    }
  },

  'background-removal': {
    toolId: 'background-removal',
    toolName: 'Background Removal',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFilesPerTask: 1,
      advancedFeatures: false // Basic removal only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFilesPerTask: 3,
      advancedFeatures: true // Edge feathering, shadow preservation
    }
  },

  // Web Tools
  'html-to-markdown': {
    toolId: 'html-to-markdown',
    toolName: 'HTML to Markdown',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 2 * 1024 * 1024, // 2 MB for HTML
      advancedFeatures: false // Basic conversion
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFileSize: 20 * 1024 * 1024, // 20 MB for HTML
      advancedFeatures: true // Preserve images, inline styles
    }
  },

  'text-extraction': {
    toolId: 'text-extraction',
    toolName: 'Text Extraction',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 5 * 1024 * 1024, // 5 MB for text
      advancedFeatures: false // Basic extraction only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFileSize: 50 * 1024 * 1024, // 50 MB for text
      advancedFeatures: true // Full article, metadata extraction
    }
  },

  'screenshot-tool': {
    toolId: 'screenshot-tool',
    toolName: 'Screenshot Tool',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFilesPerTask: 1,
      advancedFeatures: false // Visible area only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFilesPerTask: 3,
      advancedFeatures: true // Full page, custom dimensions
    }
  },

  // AI Tools
  'text-summarization': {
    toolId: 'text-summarization',
    toolName: 'Text Summarization',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 5 * 1024 * 1024, // 5 MB for text
      advancedFeatures: false // Basic summarization
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFileSize: 50 * 1024 * 1024, // 50 MB for text
      advancedFeatures: true // AI-powered, multiple languages
    }
  },

  'content-cleaning': {
    toolId: 'content-cleaning',
    toolName: 'Content Cleaning',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 5 * 1024 * 1024,
      advancedFeatures: false // Basic cleaning
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFileSize: 50 * 1024 * 1024,
      advancedFeatures: true // AI-powered cleaning
    }
  },

  'smart-processing': {
    toolId: 'smart-processing',
    toolName: 'Smart Processing',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 5 * 1024 * 1024,
      advancedFeatures: false // Basic suggestions
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      maxFileSize: 50 * 1024 * 1024,
      advancedFeatures: true // AI analysis, custom workflows
    }
  },

  // Security Tools (Pro only)
  'pdf-password-remove': {
    toolId: 'pdf-password-remove',
    toolName: 'Remove PDF Password',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 0, // Not available in free plan
      advancedFeatures: false
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      advancedFeatures: true // Brute force, advanced decryption
    }
  },

  'pdf-password-protect': {
    toolId: 'pdf-password-protect',
    toolName: 'Add PDF Password',
    free: {
      ...UNIVERSAL_LIMITS.free,
      advancedFeatures: false // Basic encryption only
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      advancedFeatures: true // Strong encryption, permissions
    }
  },

  'pdf-encrypt': {
    toolId: 'pdf-encrypt',
    toolName: 'Advanced PDF Encryption',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 0, // Not available in free plan
      advancedFeatures: false
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      advancedFeatures: true // Custom algorithms, expiry dates
    }
  },

  // E-Signature Tools (Pro only)
  'digital-signature': {
    toolId: 'digital-signature',
    toolName: 'Digital Signature',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 0, // Not available in free plan
      advancedFeatures: false
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      advancedFeatures: true // Multiple signatures, certificates
    }
  },

  'form-filling': {
    toolId: 'form-filling',
    toolName: 'PDF Form Filling',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 0, // Not available in free plan
      advancedFeatures: false
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      advancedFeatures: true // Auto-detection, templates, batch
    }
  },

  'signature-verification': {
    toolId: 'signature-verification',
    toolName: 'Signature Verification',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 0, // Not available in free plan
      advancedFeatures: false
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      advancedFeatures: true // Certificate validation, audit trails
    }
  },

  // Advanced Tools (Pro only)
  'folder-processing': {
    toolId: 'folder-processing',
    toolName: 'Folder Processing',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 0, // Not available in free plan
      advancedFeatures: false
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      advancedFeatures: true // Recursive processing, file filters
    }
  },

  'workflow-automation': {
    toolId: 'workflow-automation',
    toolName: 'Workflow Automation',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 0, // Not available in free plan
      advancedFeatures: false
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      advancedFeatures: true // Custom workflows, API integration
    }
  },

  'batch-conversion': {
    toolId: 'batch-conversion',
    toolName: 'Batch Conversion',
    free: {
      ...UNIVERSAL_LIMITS.free,
      maxFileSize: 0, // Not available in free plan
      advancedFeatures: false
    },
    pro: {
      ...UNIVERSAL_LIMITS.pro,
      advancedFeatures: true // Parallel processing, quality preservation
    }
  }
}

// Helper functions
export function getToolLimits(toolId: string): ToolLimits | undefined {
  return TOOL_LIMITS[toolId]
}

export function getFeatureLimits(toolId: string, plan: PlanType): FeatureLimits | undefined {
  const toolLimits = getToolLimits(toolId)
  return toolLimits ? toolLimits[plan] : undefined
}

export function canUserAccessTool(toolId: string, plan: PlanType): boolean {
  const limits = getFeatureLimits(toolId, plan)
  return limits ? limits.maxFileSize > 0 : false
}

export function getUpgradeTriggers(toolId: string, currentPlan: PlanType): string[] {
  if (currentPlan === 'pro') return []
  
  const freeLimits = getFeatureLimits(toolId, 'free')
  const proLimits = getFeatureLimits(toolId, 'pro')
  
  if (!freeLimits || !proLimits) return []
  
  const triggers: string[] = []
  
  if (freeLimits.maxFileSize < proLimits.maxFileSize) {
    triggers.push(`File size limit: ${Math.round(freeLimits.maxFileSize / (1024 * 1024))}MB → ${Math.round(proLimits.maxFileSize / (1024 * 1024))}MB`)
  }
  
  if (freeLimits.maxFilesPerTask < proLimits.maxFilesPerTask) {
    triggers.push(`Batch processing: ${freeLimits.maxFilesPerTask} file → ${proLimits.maxFilesPerTask} files`)
  }
  
  if (freeLimits.maxTasksPerHour !== -1) {
    triggers.push(`Hourly limit: ${freeLimits.maxTasksPerHour} tasks → Unlimited`)
  }
  
  if (!freeLimits.advancedFeatures && proLimits.advancedFeatures) {
    triggers.push('Advanced features unlocked')
  }
  
  if (freeLimits.watermark && !proLimits.watermark) {
    triggers.push('No watermarks')
  }
  
  return triggers
}

export function checkFileSizeLimit(toolId: string, plan: PlanType, fileSize: number): boolean {
  const limits = getFeatureLimits(toolId, plan)
  return limits ? fileSize <= limits.maxFileSize : false
}

export function checkFileCountLimit(toolId: string, plan: PlanType, fileCount: number): boolean {
  const limits = getFeatureLimits(toolId, plan)
  return limits ? fileCount <= limits.maxFilesPerTask : false
}

export function checkPageLimit(toolId: string, plan: PlanType, pageCount: number): boolean {
  const limits = getFeatureLimits(toolId, plan)
  if (!limits || limits.maxPagesPerTask === undefined || limits.maxPagesPerTask === -1) return true
  return pageCount <= limits.maxPagesPerTask
}
