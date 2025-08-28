import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PricingUsageTracker } from '@/lib/pricing/usage-tracker'
import { getToolLimits } from '@/lib/pricing/feature-limits'
import { UsageTracker } from '@/lib/usage-tracker'
import { ProgressTracker } from '@/lib/progress-tracker'
import { ProcessingErrorHandler } from '@/lib/error-handler'

// Import all processing services
import { mergePDFs } from '@/lib/processing/pdf-merge'
import { compressPDF } from '@/lib/processing/pdf-compress'
import { extractFromPDF } from '@/lib/processing/pdf-extract'
import { processPDFToOffice } from '@/lib/processing/pdf-to-office'
import { compressImage } from '@/lib/processing/image-compress'
import { convertImageFormat, convertMultipleFormats } from '@/lib/processing/format-conversion'
import { processBackgroundRemoval } from '@/lib/processing/image-background-removal'
import { excelToCSV, csvToExcel } from '@/lib/processing/excel-csv'
import { formatJSON } from '@/lib/processing/json-formatter'
import { cleanExcel } from '@/lib/processing/excel-cleaner'
import { processSQLFormatter } from '@/lib/processing/sql-formatter'
import { htmlToMarkdown } from '@/lib/processing/html-markdown'
import { extractTextFromUrl } from '@/lib/processing/text-extraction'
import { extractTextOCR } from '@/lib/processing/ocr-extract'

// Wrapper functions to standardize interface
const wrapSingleFileFunction = (fn: (file: File, options: any) => Promise<any>) => {
  return (files: File[], options: any, progressTracker?: any) => fn(files[0], options)
}

const PROCESSING_SERVICES: Record<string, (files: File[], options: any, progressTracker?: any) => Promise<any>> = {
  // PDF Tools
  'pdf-merge': mergePDFs,
  'pdf-compress': wrapSingleFileFunction(compressPDF),
  'pdf-extract': wrapSingleFileFunction(extractFromPDF),
  'pdf-to-office': processPDFToOffice,
  
  // Data Tools
  'excel-to-csv': wrapSingleFileFunction(excelToCSV),
  'csv-to-excel': wrapSingleFileFunction(csvToExcel),
  'json-formatter': wrapSingleFileFunction(formatJSON),
  'excel-cleaner': wrapSingleFileFunction(cleanExcel),
  'sql-formatter': processSQLFormatter,
  
  // Media Tools
  'image-compression': wrapSingleFileFunction(compressImage),
  'format-conversion': async (files: File[], options: any, progressTracker?: any) => {
    if (files.length === 1) {
      return convertImageFormat(files[0], options)
    } else {
      return convertMultipleFormats(files, options)
    }
  },
  'ocr-extraction': wrapSingleFileFunction(extractTextOCR),
  'background-removal': processBackgroundRemoval,
  
  // Web Tools
  'html-to-markdown': wrapSingleFileFunction(htmlToMarkdown),
  'text-extraction': async (files: File[], options: any, progressTracker?: any) => {
    const url = await files[0].text()
    return extractTextFromUrl(url, options)
  },
  'screenshot-tool': async (files: File[], options: any, progressTracker?: any) => {
    const url = await files[0].text()
    // Placeholder - needs proper implementation
    return {
      success: true,
      screenshot: new Uint8Array(0),
      metadata: { width: 1920, height: 1080 }
    }
  },
  
  // Security Tools (placeholders)
  'pdf-password-remove': wrapSingleFileFunction(async (file: File, options: any) => {
    return {
      success: true,
      processedPdf: new Uint8Array(0),
      metadata: { passwordRemoved: true }
    }
  }),
  'pdf-password-protect': wrapSingleFileFunction(async (file: File, options: any) => {
    return {
      success: true,
      processedPdf: new Uint8Array(0),
      metadata: { passwordProtected: true }
    }
  }),
  'pdf-encrypt': wrapSingleFileFunction(async (file: File, options: any) => {
    return {
      success: true,
      processedPdf: new Uint8Array(0),
      metadata: { encrypted: true }
    }
  }),
  
  // E-Signature Tools (placeholders)
  'digital-signature': wrapSingleFileFunction(async (file: File, options: any) => {
    return {
      success: true,
      processedPdf: new Uint8Array(0),
      metadata: { signed: true }
    }
  }),
  'form-filling': wrapSingleFileFunction(async (file: File, options: any) => {
    return {
      success: true,
      processedPdf: new Uint8Array(0),
      metadata: { filled: true }
    }
  }),
  'signature-verification': wrapSingleFileFunction(async (file: File, options: any) => {
    return {
      success: true,
      metadata: { verified: true }
    }
  }),
  
  // Advanced Tools (placeholders)
  'folder-processing': async (files: File[], options: any, progressTracker?: any) => {
    return {
      success: true,
      processedFiles: files.length,
      metadata: { processed: true }
    }
  },
  'workflow-automation': async (files: File[], options: any, progressTracker?: any) => {
    return {
      success: true,
      workflowCreated: true,
      metadata: { automated: true }
    }
  },
  'batch-conversion': async (files: File[], options: any, progressTracker?: any) => {
    return {
      success: true,
      convertedFiles: files.length,
      metadata: { converted: true }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = session?.user?.id || 'guest'
    
    const formData = await request.formData()
    const toolId = formData.get('toolId') as string
    const files = formData.getAll('files') as File[]
    const options = JSON.parse(formData.get('options') as string || '{}')

    if (!toolId || !files || files.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: toolId, files' },
        { status: 400 }
      )
    }

    // Check pricing limits before processing
    const totalFileSize = files.reduce((sum, file) => sum + file.size, 0)
    const fileCount = files.length
    
    // Get page count for PDF tools
    let pageCount: number | undefined
    if (toolId.includes('pdf') && files[0]) {
      try {
        // Simple page count estimation for PDFs
        const arrayBuffer = await files[0].arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        const pdfHeader = uint8Array.slice(0, 1024)
        const text = new TextDecoder().decode(pdfHeader)
        const pageMatch = text.match(/\/Count\s+(\d+)/)
        pageCount = pageMatch ? parseInt(pageMatch[1]) : undefined
      } catch (error) {
        console.warn('Could not determine PDF page count:', error)
      }
    }

    // Check usage limits
    const usageCheck = await PricingUsageTracker.checkToolUsage(
      userId,
      toolId,
      totalFileSize,
      fileCount,
      pageCount
    )

    if (!usageCheck.canProceed) {
      return NextResponse.json({
        error: 'Usage limit exceeded',
        reason: usageCheck.reason,
        upgradeTriggers: usageCheck.upgradeTriggers,
        currentPlan: usageCheck.plan,
        currentUsage: usageCheck.currentUsage,
        limit: usageCheck.limit
      }, { status: 429 })
    }

    // Get tool limits for processing
    const toolLimits = getToolLimits(toolId)
    const plan = usageCheck.plan // Use the actual plan from usage check
    const limits = toolLimits?.[plan]

    // Process files according to plan limits
    let processedFiles = files
    
    // Apply file count limits for free plan
    if (plan === 'free' && limits && files.length > limits.maxFilesPerTask) {
      processedFiles = files.slice(0, limits.maxFilesPerTask)
    }

    // Apply page limits for PDF tools
    if (plan === 'free' && limits?.maxPagesPerTask && pageCount && pageCount > limits.maxPagesPerTask) {
      // For free plan, limit processing to allowed pages
      // This would need to be implemented in the specific PDF processing functions
      console.log(`Free plan: limiting to ${limits.maxPagesPerTask} pages`)
    }

    // Process the files
    const processingService = PROCESSING_SERVICES[toolId]
    if (!processingService) {
      return NextResponse.json(
        { error: `Tool ${toolId} not supported` },
        { status: 400 }
      )
    }

    const result = await processingService(processedFiles, options)

    // Track usage after successful processing
    if (result.success) {
      await PricingUsageTracker.trackUsage(
        userId,
        toolId,
        toolLimits?.toolName || toolId,
        totalFileSize,
        fileCount,
        pageCount
      )
    }

    // Add plan information to response
    const response = {
      ...result,
      plan: usageCheck.plan,
      upgradeTriggers: usageCheck.upgradeTriggers,
      limits: {
        maxFileSize: limits?.maxFileSize,
        maxFilesPerTask: limits?.maxFilesPerTask,
        maxPagesPerTask: limits?.maxPagesPerTask,
        maxTasksPerHour: limits?.maxTasksPerHour
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get processing status/progress
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
    }

    // In a real implementation, you'd fetch job status from database/cache
    // For now, return a mock response
    return NextResponse.json({
      jobId,
      status: 'completed',
      progress: 100,
      message: 'Processing complete'
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' }, 
      { status: 500 }
    )
  }
}
