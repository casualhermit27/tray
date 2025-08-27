import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

// Get Gemini model
const getGeminiModel = () => {
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  return genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: Number(process.env.GEMINI_TEMPERATURE) || 0.7,
      topP: Number(process.env.GEMINI_TOP_P) || 0.9,
      topK: Number(process.env.GEMINI_TOP_K) || 40,
      maxOutputTokens: Number(process.env.GEMINI_MAX_TOKENS) || 8192,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: process.env.GEMINI_SAFETY_SETTINGS === 'low' ? HarmBlockThreshold.BLOCK_NONE : 
                  process.env.GEMINI_SAFETY_SETTINGS === 'high' ? HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE : HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: process.env.GEMINI_SAFETY_SETTINGS === 'low' ? HarmBlockThreshold.BLOCK_NONE : 
                  process.env.GEMINI_SAFETY_SETTINGS === 'high' ? HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE : HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: process.env.GEMINI_SAFETY_SETTINGS === 'low' ? HarmBlockThreshold.BLOCK_NONE : 
                  process.env.GEMINI_SAFETY_SETTINGS === 'high' ? HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE : HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: process.env.GEMINI_SAFETY_SETTINGS === 'low' ? HarmBlockThreshold.BLOCK_NONE : 
                  process.env.GEMINI_SAFETY_SETTINGS === 'high' ? HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE : HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
      }
    ]
  })
}

// Text summarization using Gemini
export async function summarizeTextWithGemini(
  text: string,
  options: {
    summaryLength: 'short' | 'medium' | 'long'
    language?: 'en' | 'fr' | 'de' | 'es'
    focus?: 'general' | 'technical' | 'creative'
  }
): Promise<{
  success: boolean
  summary?: string
  error?: string
  model: string
  confidence: number
}> {
  try {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    const model = getGeminiModel()
    
    const lengthInstructions = {
      short: 'Create a very brief summary in 1-2 sentences',
      medium: 'Create a medium-length summary in 3-5 bullet points',
      long: 'Create a detailed summary in 2-3 paragraphs'
    }

    const focusInstructions = {
      general: 'Focus on the main ideas and key points',
      technical: 'Focus on technical details, data, and specifications',
      creative: 'Focus on creative elements, themes, and narrative structure'
    }

    const prompt = `
Please summarize the following text according to these requirements:

${lengthInstructions[options.summaryLength]}
${options.focus ? focusInstructions[options.focus] : ''}
${options.language && options.language !== 'en' ? `Respond in ${options.language === 'fr' ? 'French' : options.language === 'de' ? 'German' : 'Spanish'}` : ''}

Text to summarize:
${text}

Summary:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text()

    return {
      success: true,
      summary: summary.trim(),
      model: 'Google Gemini 1.5',
      confidence: 0.95
    }

  } catch (error) {
    console.error('Gemini summarization error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      model: 'Google Gemini 1.5',
      confidence: 0
    }
  }
}

// Content analysis and suggestions using Gemini
export async function analyzeContentWithGemini(
  text: string,
  options: {
    analysisType: 'general' | 'technical' | 'creative' | 'business'
    includeSuggestions: boolean
  }
): Promise<{
  success: boolean
  analysis?: {
    contentType: string
    complexity: 'simple' | 'medium' | 'complex'
    language: string
    wordCount: number
    keyTopics: string[]
    sentiment: 'positive' | 'neutral' | 'negative'
  }
  suggestions?: Array<{
    action: string
    description: string
    confidence: number
    toolId: string
    options?: Record<string, any>
  }>
  error?: string
  model: string
}> {
  try {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    const model = getGeminiModel()
    
    const prompt = `
Analyze the following text and provide insights:

Text: ${text}

Please analyze:
1. Content type (document, email, social media, technical, creative, etc.)
2. Complexity level (simple, medium, complex)
3. Language/dialect used
4. Word count
5. Key topics/themes
6. Overall sentiment (positive, neutral, negative)

${options.includeSuggestions ? `
Also suggest 3-5 processing actions that would be helpful for this content, including:
- Action name
- Description of what it would do
- Confidence level (0.0-1.0)
- Recommended tool ID from: text-summarization, content-cleaning, html-to-markdown, excel-to-csv, json-formatter
- Any specific options for the tool

Format suggestions as JSON array.` : ''}

Provide your response in this JSON format:
{
  "analysis": {
    "contentType": "...",
    "complexity": "...",
    "language": "...",
    "wordCount": number,
    "keyTopics": ["...", "..."],
    "sentiment": "..."
  }${options.includeSuggestions ? `,
  "suggestions": [
    {
      "action": "...",
      "description": "...",
      "confidence": 0.0,
      "toolId": "...",
      "options": {}
    }
  ]` : ''}
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysisText = response.text()

    // Parse the JSON response
    const analysis = JSON.parse(analysisText)

    return {
      success: true,
      analysis: analysis.analysis,
      suggestions: analysis.suggestions,
      model: 'Google Gemini 1.5'
    }

  } catch (error) {
    console.error('Gemini content analysis error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      model: 'Google Gemini 1.5'
    }
  }
}

// Content cleaning using Gemini
export async function cleanContentWithGemini(
  text: string,
  options: {
    removeLineBreaks: boolean
    fixSpacing: boolean
    removeHtmlTags: boolean
    normalizeFormatting: boolean
    targetFormat: 'plain' | 'academic' | 'casual'
  }
): Promise<{
  success: boolean
  cleanedText?: string
  error?: string
  model: string
  changes: string[]
}> {
  try {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    const model = getGeminiModel()
    
    const cleaningInstructions = []
    if (options.removeLineBreaks) cleaningInstructions.push('Remove unnecessary line breaks while preserving paragraph structure')
    if (options.fixSpacing) cleaningInstructions.push('Fix spacing issues, extra spaces, and punctuation')
    if (options.removeHtmlTags) cleaningInstructions.push('Remove all HTML tags and decode HTML entities')
    if (options.normalizeFormatting) cleaningInstructions.push('Normalize text formatting for consistency')

    const formatInstructions = {
      plain: 'Format as clean, plain text',
      academic: 'Format as academic/professional text',
      casual: 'Format as casual conversation'
    }

    const prompt = `
Clean and format the following text according to these requirements:

Cleaning tasks:
${cleaningInstructions.join('\n')}

Target format: ${formatInstructions[options.targetFormat]}

Original text:
${text}

Please provide:
1. The cleaned and formatted text
2. A list of changes made (e.g., "Removed 5 HTML tags", "Fixed spacing in 3 locations")

Format your response as:
CLEANED_TEXT:
[cleaned text here]

CHANGES:
[list of changes made]`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()

    // Parse the response
    const cleanedTextMatch = responseText.match(/CLEANED_TEXT:\s*([\s\S]*?)(?=CHANGES:|$)/)
    const changesMatch = responseText.match(/CHANGES:\s*([\s\S]*?)$/)

    const cleanedText = cleanedTextMatch ? cleanedTextMatch[1].trim() : text
    const changes = changesMatch ? [changesMatch[1].trim()] : ['Text cleaned and formatted']

    return {
      success: true,
      cleanedText,
      model: 'Google Gemini 1.5',
      changes
    }

  } catch (error) {
    console.error('Gemini content cleaning error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      model: 'Google Gemini 1.5',
      changes: []
    }
  }
}

// Check if Gemini is available
export function isGeminiAvailable(): boolean {
  return !!process.env.GOOGLE_GEMINI_API_KEY
}

// Get Gemini model info
export function getGeminiModelInfo() {
  return {
    name: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    provider: 'Google',
    maxTokens: Number(process.env.GEMINI_MAX_TOKENS) || 8192,
    temperature: Number(process.env.GEMINI_TEMPERATURE) || 0.7
  }
}
