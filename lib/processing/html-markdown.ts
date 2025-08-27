export interface HTMLToMarkdownOptions {
  preserveLinks: boolean
  headingStyle?: 'atx' | 'setext'
  codeBlockStyle?: 'fenced' | 'indented'
}

export interface HTMLToMarkdownResult {
  success: boolean
  markdown?: string
  error?: string
  originalSize: number
  finalSize: number
  conversionRatio: number
}

export async function htmlToMarkdown(
  file: File,
  options: HTMLToMarkdownOptions
): Promise<HTMLToMarkdownResult> {
  try {
    const htmlContent = await file.text()
    
    // This would use the turndown library
    // For now, we'll simulate the conversion
    
    // Simulate HTML to Markdown conversion
    let markdown = htmlContent
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, content) => {
        let counter = 1
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`)
      })
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1')
    
    // Handle links
    if (options.preserveLinks) {
      markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    } else {
      markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '$2')
    }
    
    // Clean up extra whitespace and HTML tags
    markdown = markdown
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive blank lines
      .replace(/^\s+|\s+$/gm, '') // Trim whitespace from each line
      .trim()
    
    const conversionRatio = ((htmlContent.length - markdown.length) / htmlContent.length) * 100
    
    return {
      success: true,
      markdown,
      originalSize: htmlContent.length,
      finalSize: markdown.length,
      conversionRatio: Math.round(conversionRatio * 100) / 100
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      originalSize: file.size,
      finalSize: 0,
      conversionRatio: 0
    }
  }
}

// Function to convert Markdown back to HTML (reverse conversion)
export async function markdownToHTML(
  file: File
): Promise<HTMLToMarkdownResult> {
  try {
    const markdownContent = await file.text()
    
    // Simple Markdown to HTML conversion
    let html = markdownContent
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
      .replace(/> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\n\n/g, '</p><p>')
    
    // Wrap in paragraph tags
    html = `<p>${html}</p>`
    
    const conversionRatio = ((markdownContent.length - html.length) / markdownContent.length) * 100
    
    return {
      success: true,
      markdown: html, // Reusing the interface, but this is actually HTML
      originalSize: markdownContent.length,
      finalSize: html.length,
      conversionRatio: Math.round(conversionRatio * 100) / 100
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      originalSize: file.size,
      finalSize: 0,
      conversionRatio: 0
    }
  }
}
