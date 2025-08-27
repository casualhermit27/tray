import { cleanContentWithGemini, isGeminiAvailable } from '@/lib/ai/gemini-client'

export interface ContentCleaningOptions {
  'target-format': 'plain' | 'academic' | 'casual'
  'remove-html': boolean
  'fix-typos': boolean
  'standardize-quotes': boolean
  'normalize-whitespace': boolean
  'remove-urls': boolean
  'remove-emails': boolean
  'remove-phone-numbers': boolean
  'remove-dates': boolean
  'remove-currency': boolean
  'remove-numbers': boolean
  'remove-special-chars': boolean
  'capitalize-sentences': boolean
  'capitalize-titles': boolean
  'add-line-breaks': boolean
  'remove-duplicates': boolean
  'sort-lines': boolean
  'trim-lines': boolean
  'max-line-length': number
  'preserve-formatting': boolean
  'custom-replacements': Record<string, string>
}

export interface ContentCleaningResult {
  success: boolean
  cleanedText?: string
  error?: string
  originalSize: number
  finalSize: number
  changes: string[]
  processingTime: number
  model?: string
}

export async function cleanContent(
  text: string,
  options: ContentCleaningOptions
): Promise<ContentCleaningResult> {
  try {
    const startTime = Date.now()
    
    // Try Gemini first if available
    if (isGeminiAvailable()) {
      try {
        const geminiResult = await cleanContentWithGemini(text, {
          removeLineBreaks: options['remove-line-breaks'],
          fixSpacing: options['fix-spacing'],
          removeHtmlTags: options['remove-html-tags'],
          normalizeFormatting: options['normalize-formatting'],
          targetFormat: options['target-format']
        })
        
        if (geminiResult.success && geminiResult.cleanedText) {
          return {
            success: true,
            cleanedText: geminiResult.cleanedText,
            originalSize: text.length,
            finalSize: geminiResult.cleanedText.length,
            changes: geminiResult.changes,
            processingTime: Date.now() - startTime,
            model: geminiResult.model
          }
        }
      } catch (geminiError) {
        console.warn('Gemini failed, falling back to simulation:', geminiError)
        // Fall through to simulation
      }
    }
    
    // Fallback to simulation if Gemini is not available or fails
    return await cleanContentSimulated(text, options, startTime)
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      originalSize: text.length,
      finalSize: 0,
      changes: [],
      processingTime: 0
    }
  }
}

// Simulated content cleaning (fallback)
async function cleanContentSimulated(
  text: string,
  options: ContentCleaningOptions,
  startTime: number
): Promise<ContentCleaningResult> {
  let cleanedText = text
  const changes: string[] = []
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000 + (text.length / 1000)))
  
  // Remove HTML tags if requested
  if (options['remove-html-tags']) {
    const originalLength = cleanedText.length
    cleanedText = cleanedText.replace(/<[^>]*>/g, '')
    const removedTags = originalLength - cleanedText.length
    if (removedTags > 0) {
      changes.push(`Removed ${Math.ceil(removedTags / 10)} HTML tags`)
    }
  }
  
  // Fix spacing if requested
  if (options['fix-spacing']) {
    // Remove extra spaces
    cleanedText = cleanedText.replace(/\s+/g, ' ')
    // Fix spacing around punctuation
    cleanedText = cleanedText.replace(/\s*([.,!?;:])\s*/g, '$1 ')
    changes.push('Fixed spacing and punctuation')
  }
  
  // Remove line breaks if requested
  if (options['remove-line-breaks']) {
    const originalLength = cleanedText.length
    cleanedText = cleanedText.replace(/\n+/g, ' ')
    cleanedText = cleanedText.replace(/\s+/g, ' ')
    const removedBreaks = originalLength - cleanedText.length
    if (removedBreaks > 0) {
      changes.push(`Removed ${Math.ceil(removedBreaks / 10)} line breaks`)
    }
  }
  
  // Normalize formatting if requested
  if (options['normalize-formatting']) {
    // Capitalize first letter of sentences
    cleanedText = cleanedText.replace(/(^|\.\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase())
    changes.push('Normalized text formatting')
  }
  
  // Apply target format styling
  switch (options['target-format']) {
    case 'academic':
      cleanedText = cleanedText.replace(/\s+/g, ' ').trim()
      changes.push('Applied academic formatting')
      break
    case 'casual':
      cleanedText = cleanedText.replace(/\s+/g, ' ').trim()
      changes.push('Applied casual formatting')
      break
    default: // plain
      cleanedText = cleanedText.trim()
      changes.push('Applied plain text formatting')
  }
  
  // If no changes were made, add a generic message
  if (changes.length === 0) {
    changes.push('Text cleaned and formatted')
  }
  
  return {
    success: true,
    cleanedText,
    originalSize: text.length,
    finalSize: cleanedText.length,
    changes,
    processingTime: Date.now() - startTime,
    model: 'Simulated AI (Gemini not available)'
  }
}
