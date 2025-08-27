export interface SQLFormatterOptions {
  indentation: '2spaces' | '4spaces' | 'tabs'
  caseStyle: 'lowercase' | 'uppercase' | 'capitalize'
  maxLineLength: number
  alignKeywords: boolean
  alignOperators: boolean
  removeComments: boolean
  compactMode: boolean
}

export async function processSQLFormatter(
  files: File[],
  options: SQLFormatterOptions,
  progressTracker?: any
): Promise<any> {
  if (files.length === 0) {
    throw new Error('No files provided')
  }

  const file = files[0]
  
  if (progressTracker) {
    progressTracker.updateProgress('Reading SQL file...', 20)
  }

  try {
    const sqlContent = await file.text()
    
    if (progressTracker) {
      progressTracker.updateProgress('Parsing SQL...', 40)
    }

    const formattedSQL = formatSQL(sqlContent, options)
    
    if (progressTracker) {
      progressTracker.updateProgress('Finalizing...', 80)
    }

    // Create downloadable file
    const blob = new Blob([formattedSQL], { type: 'text/plain' })
    const downloadUrl = URL.createObjectURL(blob)

    return {
      success: true,
      originalSize: file.size,
      finalSize: blob.size,
      originalSQL: sqlContent,
      formattedSQL,
      downloadUrl,
      metadata: {
        lineCount: formattedSQL.split('\n').length,
        wordCount: formattedSQL.split(/\s+/).length,
        indentation: options.indentation,
        caseStyle: options.caseStyle
      }
    }

  } catch (error) {
    throw new Error(`SQL formatting failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function formatSQL(sql: string, options: SQLFormatterOptions): string {
  let formatted = sql

  // Remove comments if requested
  if (options.removeComments) {
    formatted = removeSQLComments(formatted)
  }

  // Parse and tokenize SQL
  const tokens = tokenizeSQL(formatted)
  
  // Apply formatting
  formatted = applyFormatting(tokens, options)
  
  // Apply case styling
  formatted = applyCaseStyling(formatted, options.caseStyle)
  
  // Apply indentation
  formatted = applyIndentation(formatted, options.indentation)
  
  // Apply alignment
  if (options.alignKeywords) {
    formatted = alignKeywords(formatted)
  }
  
  if (options.alignOperators) {
    formatted = alignOperators(formatted)
  }

  return formatted
}

function removeSQLComments(sql: string): string {
  // Remove single-line comments (-- comment)
  sql = sql.replace(/--.*$/gm, '')
  
  // Remove multi-line comments (/* comment */)
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, '')
  
  return sql
}

function tokenizeSQL(sql: string): string[] {
  // Simple SQL tokenization - split by common SQL delimiters
  const tokens = sql
    .split(/(\s+|[,;()\[\]{}+\-*/=<>!&|]+)/)
    .filter(token => token.trim().length > 0)
  
  return tokens
}

function applyFormatting(tokens: string[], options: SQLFormatterOptions): string {
  let result = ''
  let indentLevel = 0
  let inParentheses = 0
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const nextToken = tokens[i + 1]
    const prevToken = tokens[i - 1]
    
    // Handle parentheses
    if (token === '(') {
      inParentheses++
      result += token + '\n' + ' '.repeat(indentLevel * getIndentSize(options.indentation))
      indentLevel++
    } else if (token === ')') {
      inParentheses--
      indentLevel = Math.max(0, indentLevel - 1)
      result += '\n' + ' '.repeat(indentLevel * getIndentSize(options.indentation)) + token
    }
    // Handle keywords
    else if (isSQLKeyword(token)) {
      if (shouldAddNewlineBefore(token, prevToken)) {
        result += '\n' + ' '.repeat(indentLevel * getIndentSize(options.indentation))
      }
      result += token
      if (shouldAddNewlineAfter(token, nextToken)) {
        result += '\n'
        indentLevel++
      }
    }
    // Handle operators
    else if (isSQLOperator(token)) {
      result += ' ' + token + ' '
    }
    // Handle delimiters
    else if (token === ',') {
      result += token + ' '
      if (inParentheses > 0) {
        result += '\n' + ' '.repeat(indentLevel * getIndentSize(options.indentation))
      }
    }
    // Handle semicolons
    else if (token === ';') {
      result += token + '\n\n'
      indentLevel = 0
    }
    // Regular tokens
    else {
      result += token
    }
  }
  
  return result
}

function isSQLKeyword(token: string): boolean {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER',
    'TABLE', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION', 'TRIGGER', 'DATABASE', 'SCHEMA',
    'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING',
    'UNION', 'ALL', 'DISTINCT', 'AS', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
    'AND', 'OR', 'NOT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'BEGIN', 'TRY',
    'CATCH', 'THROW', 'RETURN', 'DECLARE', 'SET', 'PRINT', 'EXEC', 'EXECUTE'
  ]
  
  return keywords.includes(token.toUpperCase())
}

function isSQLOperator(token: string): boolean {
  const operators = ['+', '-', '*', '/', '=', '<>', '!=', '<=', '>=', '<', '>', '||', '&&']
  return operators.includes(token)
}

function shouldAddNewlineBefore(token: string, prevToken?: string): boolean {
  const newlineBefore = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'GROUP', 'ORDER', 'HAVING', 'UNION']
  return newlineBefore.includes(token.toUpperCase()) && !!prevToken && prevToken !== '\n'
}

function shouldAddNewlineAfter(token: string, nextToken?: string): boolean {
  const newlineAfter = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP', 'ORDER', 'HAVING', 'UNION']
  return newlineAfter.includes(token.toUpperCase()) && !!nextToken && nextToken !== '\n'
}

function getIndentSize(indentation: string): number {
  switch (indentation) {
    case '2spaces': return 2
    case '4spaces': return 4
    case 'tabs': return 1
    default: return 2
  }
}

function applyCaseStyling(sql: string, caseStyle: string): string {
  switch (caseStyle) {
    case 'lowercase':
      return sql.toLowerCase()
    case 'uppercase':
      return sql.toUpperCase()
    case 'capitalize':
      return sql.replace(/\b\w+/g, (word) => {
        if (isSQLKeyword(word)) {
          return word.toUpperCase()
        }
        return word.toLowerCase()
      })
    default:
      return sql
  }
}

function applyIndentation(sql: string, indentation: string): string {
  const indentChar = indentation === 'tabs' ? '\t' : ' '
  const indentSize = getIndentSize(indentation)
  
  const lines = sql.split('\n')
  let currentIndent = 0
  
  return lines.map(line => {
    const trimmed = line.trim()
    if (trimmed.length === 0) return ''
    
    // Adjust indent level based on line content
    if (trimmed.includes('(')) currentIndent++
    if (trimmed.includes(')')) currentIndent = Math.max(0, currentIndent - 1)
    
    const indent = indentChar.repeat(currentIndent * indentSize)
    return indent + trimmed
  }).join('\n')
}

function alignKeywords(sql: string): string {
  // Simple keyword alignment - align SELECT, FROM, WHERE at same column
  const lines = sql.split('\n')
  const keywordLines = lines.filter(line => 
    /^\s*(SELECT|FROM|WHERE|JOIN|GROUP|ORDER|HAVING|UNION)/i.test(line)
  )
  
  if (keywordLines.length === 0) return sql
  
  // Find the maximum indent position
  const maxIndent = Math.max(...keywordLines.map(line => line.search(/\S/)))
  
  return lines.map(line => {
    if (/^\s*(SELECT|FROM|WHERE|JOIN|GROUP|ORDER|HAVING|UNION)/i.test(line)) {
      const indent = ' '.repeat(maxIndent)
      return indent + line.trim()
    }
    return line
  }).join('\n')
}

function alignOperators(sql: string): string {
  // Align operators like =, <>, etc. in WHERE clauses
  const lines = sql.split('\n')
  
  return lines.map(line => {
    if (line.includes('=') || line.includes('<>') || line.includes('!=') || 
        line.includes('<=') || line.includes('>=') || line.includes('<') || line.includes('>')) {
      
      const parts = line.split(/(=|<>=?|!>=?|<=?|>=?)/)
      if (parts.length >= 3) {
        const leftPart = parts[0].trim()
        const operator = parts[1]
        const rightPart = parts.slice(2).join('').trim()
        
        // Pad left part to align operators
        const maxLeftLength = 30 // Reasonable max length for alignment
        const paddedLeft = leftPart.padEnd(Math.min(maxLeftLength, leftPart.length + 10))
        
        return paddedLeft + ' ' + operator + ' ' + rightPart
      }
    }
    return line
  }).join('\n')
}
