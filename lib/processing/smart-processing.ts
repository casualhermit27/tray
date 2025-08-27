import { analyzeContentWithGemini, isGeminiAvailable } from '@/lib/ai/gemini-client'

export interface SmartProcessingOptions {
  'suggestion-mode'?: 'auto' | 'manual'
  'pipeline-mode'?: boolean
  'save-workflow'?: boolean
}

export interface ProcessingSuggestion {
  action: string
  confidence: number
  description: string
  toolId: string
  options?: Record<string, any>
}

export interface SmartProcessingResult {
  success: boolean
  suggestions?: ProcessingSuggestion[]
  error?: string
  originalSize: number
  finalSize: number
  metadata?: {
    contentType: string
    wordCount: number
    language: string
    complexity: 'simple' | 'medium' | 'complex'
    processingTime: number
  }
}

export async function analyzeAndSuggest(
  file: File,
  options: SmartProcessingOptions
): Promise<SmartProcessingResult> {
  try {
    const startTime = Date.now()
    const text = await file.text()
    const wordCount = text.split(/\s+/).length
    const charCount = text.length
    
    // Try Gemini first if available
    if (isGeminiAvailable()) {
      try {
        const geminiResult = await analyzeContentWithGemini(text, {
          analysisType: 'general',
          includeSuggestions: true
        })
        
        if (geminiResult.success && geminiResult.analysis) {
          return {
            success: true,
            suggestions: geminiResult.suggestions || [],
            originalSize: charCount,
            finalSize: charCount,
            metadata: {
              contentType: geminiResult.analysis.contentType,
              wordCount: geminiResult.analysis.wordCount,
              language: geminiResult.analysis.language,
              complexity: geminiResult.analysis.complexity,
              processingTime: Date.now() - startTime
            }
          }
        }
      } catch (geminiError) {
        console.warn('Gemini failed, falling back to simulation:', geminiError)
        // Fall through to simulation
      }
    }
    
    // Fallback to simulation if Gemini is not available or fails
    return await analyzeAndSuggestSimulated(file, options, startTime)
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      originalSize: file.size,
      finalSize: file.size
    }
  }
}

// Simulated analysis (fallback)
async function analyzeAndSuggestSimulated(
  file: File,
  options: SmartProcessingOptions,
  startTime: number
): Promise<SmartProcessingResult> {
  const text = await file.text()
  const wordCount = text.split(/\s+/).length
  const charCount = text.length
  
  // Analyze content type and complexity
  const contentType = analyzeContentType(text)
  const language = detectLanguage(text)
  const complexity = analyzeComplexity(text, wordCount)
  
  // Generate suggestions based on content analysis
  const suggestions: ProcessingSuggestion[] = []
  
  // Content-based suggestions
  if (contentType === 'document' && wordCount > 100) {
    suggestions.push({
      action: 'Summarize content',
      confidence: 0.9,
      description: 'This document is long enough to benefit from summarization',
      toolId: 'text-summarization',
      options: { 'summary-length': 'medium' }
    })
  }
  
  if (contentType === 'web' || text.includes('<') || text.includes('>')) {
    suggestions.push({
      action: 'Convert HTML to Markdown',
      confidence: 0.8,
      description: 'Content appears to contain HTML markup',
      toolId: 'html-to-markdown',
      options: { 'keep-images': true, 'preserve-styles': false }
    })
  }
  
  if (text.includes('@') || text.includes('#')) {
    suggestions.push({
      action: 'Clean social media content',
      confidence: 0.7,
      description: 'Content appears to be from social media',
      toolId: 'content-cleaning',
      options: { 'remove-html-tags': true, 'fix-spacing': true }
    })
  }
  
  if (text.includes('From:') || text.includes('Subject:')) {
    suggestions.push({
      action: 'Clean email content',
      confidence: 0.8,
      description: 'Content appears to be an email',
      toolId: 'content-cleaning',
      options: { 'remove-line-breaks': true, 'fix-spacing': true }
    })
  }
  
  // Data-based suggestions
  if (text.includes(',') && text.split('\n').length > 5) {
    suggestions.push({
      action: 'Convert to structured format',
      confidence: 0.6,
      description: 'Content appears to be tabular data',
      toolId: 'csv-to-excel',
      options: {}
    })
  }
  
  if (text.includes('{') && text.includes('}')) {
    suggestions.push({
      action: 'Format JSON data',
      confidence: 0.7,
      description: 'Content appears to be JSON data',
      toolId: 'json-formatter',
      options: { 'format': 'beautify' }
    })
  }
  
  // Add generic suggestions if we don't have enough
  if (suggestions.length < 3) {
    suggestions.push({
      action: 'Clean and format text',
      confidence: 0.6,
      description: 'General text cleaning and formatting',
      toolId: 'content-cleaning',
      options: { 'remove-html-tags': true, 'fix-spacing': true }
    })
  }
  
  return {
    success: true,
    suggestions,
    originalSize: charCount,
    finalSize: charCount,
    metadata: {
      contentType,
      wordCount,
      language,
      complexity,
      processingTime: Date.now() - startTime
    }
  }
}

// Helper functions for content analysis
function analyzeContentType(text: string): string {
  if (text.includes('<html') || text.includes('<body')) return 'web'
  if (text.includes('From:') || text.includes('Subject:')) return 'email'
  if (text.includes('@') || text.includes('#')) return 'social'
  if (text.includes('{') && text.includes('}')) return 'json'
  if (text.includes(',') && text.split('\n').length > 5) return 'data'
  if (text.length > 1000) return 'document'
  return 'text'
}

function detectLanguage(text: string): string {
  // Simple language detection based on common words
  const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']
  const frenchWords = ['le', 'la', 'les', 'et', 'ou', 'mais', 'dans', 'sur', 'à']
  const germanWords = ['der', 'die', 'das', 'und', 'oder', 'aber', 'in', 'auf', 'zu']
  const spanishWords = ['el', 'la', 'y', 'o', 'pero', 'en', 'sobre', 'a', 'para']
  
  const textLower = text.toLowerCase()
  const words = textLower.split(/\s+/)
  
  const scores = {
    en: englishWords.filter(word => words.includes(word)).length,
    fr: frenchWords.filter(word => words.includes(word)).length,
    de: germanWords.filter(word => words.includes(word)).length,
    es: spanishWords.filter(word => words.includes(word)).length
  }
  
  const maxScore = Math.max(...Object.values(scores))
  if (maxScore === 0) return 'en' // Default to English
  
  const detectedLang = Object.keys(scores).find(lang => scores[lang as keyof typeof scores] === maxScore)
  return detectedLang || 'en'
}

function analyzeComplexity(text: string, wordCount: number): 'simple' | 'medium' | 'complex' {
  const avgWordLength = text.replace(/[^a-zA-Z]/g, '').length / wordCount
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const avgSentenceLength = wordCount / sentenceCount
  
  if (avgWordLength > 6 || avgSentenceLength > 25 || wordCount > 1000) return 'complex'
  if (avgWordLength > 5 || avgSentenceLength > 20 || wordCount > 500) return 'medium'
  return 'simple'
}
