export interface DownloadOptions {
  filename?: string
  mimeType?: string
}

export function downloadBlob(blob: Blob, options: DownloadOptions = {}) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = options.filename || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadUint8Array(data: Uint8Array, options: DownloadOptions = {}) {
  const blob = new Blob([data as BlobPart], { type: options.mimeType || 'application/octet-stream' })
  downloadBlob(blob, options)
}

export function downloadText(text: string, options: DownloadOptions = {}) {
  const blob = new Blob([text], { type: options.mimeType || 'text/plain' })
  downloadBlob(blob, options)
}

export function downloadJSON(data: any, options: DownloadOptions = {}) {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: options.mimeType || 'application/json' })
  downloadBlob(blob, options)
}

export function downloadCSV(csvContent: string, options: DownloadOptions = {}) {
  const blob = new Blob([csvContent], { type: options.mimeType || 'text/csv' })
  downloadBlob(blob, options)
}

export function downloadExcel(data: Uint8Array, options: DownloadOptions = {}) {
  const blob = new Blob([data as BlobPart], { type: options.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  downloadBlob(blob, options)
}

export function downloadPDF(data: Uint8Array, options: DownloadOptions = {}) {
  const blob = new Blob([data as BlobPart], { type: options.mimeType || 'application/pdf' })
  downloadBlob(blob, options)
}

export function downloadImage(data: Uint8Array, format: string, options: DownloadOptions = {}) {
  const mimeType = getImageMimeType(format)
  const blob = new Blob([data as BlobPart], { type: mimeType })
  downloadBlob(blob, options)
}

function getImageMimeType(format: string): string {
  switch (format.toLowerCase()) {
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    case 'gif':
      return 'image/gif'
    default:
      return 'image/png'
  }
}

export function generateFilename(originalName: string, toolId: string, extension: string): string {
  const baseName = originalName.replace(/\.[^/.]+$/, '') // Remove original extension
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  
  let prefix = ''
  switch (toolId) {
    case 'pdf-merge':
      prefix = 'merged'
      break
    case 'pdf-compress':
      prefix = 'compressed'
      break
    case 'pdf-extract':
      prefix = 'extracted'
      break
    case 'excel-to-csv':
      prefix = 'converted'
      break
    case 'csv-to-excel':
      prefix = 'converted'
      break
    case 'json-formatter':
      prefix = 'formatted'
      break
    case 'image-compression':
      prefix = 'compressed'
      break
    case 'format-conversion':
      prefix = 'converted'
      break
    case 'excel-cleaner':
      prefix = 'cleaned'
      break
    case 'ocr-extraction':
      prefix = 'extracted'
      break
    case 'html-to-markdown':
      prefix = 'converted'
      break
    case 'text-extraction':
      prefix = 'extracted'
      break
    case 'screenshot-tool':
      prefix = 'screenshot'
      break

    case 'text-summarizer':
      prefix = 'summarized'
      break
    default:
      prefix = 'processed'
  }
  
  return `${prefix}_${baseName}_${timestamp}.${extension}`
}

// Helper function to get the final filename
function getFinalFilename(customFilename: string | undefined, originalFilename: string, toolId: string, extension: string): string {
  if (customFilename) {
    // If custom filename already has an extension, use it as-is
    if (customFilename.includes('.')) {
      return customFilename
    }
    // Otherwise, add the appropriate extension
    return `${customFilename}.${extension}`
  }
  return getFinalFilename(customFilename, originalFilename, toolId, extension)
}

export function handleToolDownload(toolId: string, result: any, originalFilename: string, customFilename?: string) {
  try {
    if (!result || !result.success) {
      throw new Error('No valid result to download')
    }

    switch (toolId) {
      // PDF Tools
      case 'pdf-merge':
        if (result.mergedPdf) {
          downloadPDF(result.mergedPdf, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'pdf')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'pdf')
          })
        } else {
          throw new Error('No PDF data available for download')
        }
        break

      case 'pdf-compress':
        if (result.compressedPdf) {
          downloadPDF(result.compressedPdf, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'pdf')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'pdf')
          })
        } else {
          throw new Error('No compressed PDF data available for download')
        }
        break

      case 'pdf-extract':
        if (result.extractedPdf) {
          downloadPDF(result.extractedPdf, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'pdf')
          })
        } else if (result.extractedText) {
          downloadText(result.extractedText, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'txt')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'pdf')
          })
        } else {
          throw new Error('No extracted data available for download')
        }
        break

      // Data Tools
      case 'excel-to-csv':
        if (result.convertedData) {
          downloadCSV(result.convertedData as string, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'csv')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'csv')
          })
        } else {
          throw new Error('No CSV data available for download')
        }
        break

      case 'csv-to-excel':
        if (result.convertedData) {
          downloadExcel(result.convertedData as Uint8Array, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'xlsx')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'xlsx')
          })
        } else {
          throw new Error('No Excel data available for download')
        }
        break

      case 'json-formatter':
        if (result.formattedJson) {
          downloadJSON(result.formattedJson, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'json')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'json')
          })
        } else {
          throw new Error('No formatted JSON data available for download')
        }
        break

      case 'excel-cleaner':
        if (result.cleanedExcel) {
          downloadExcel(result.cleanedExcel, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'xlsx')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'xlsx')
          })
        } else {
          throw new Error('No cleaned Excel data available for download')
        }
        break

      // Media Tools
      case 'image-compression':
        if (result.compressedImage) {
          downloadImage(result.compressedImage, result.finalFormat || 'jpg', {
            filename: getFinalFilename(customFilename, originalFilename, toolId, result.finalFormat || 'jpg')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, result.finalFormat || 'jpg')
          })
        } else {
          throw new Error('No compressed image data available for download')
        }
        break

      case 'format-conversion':
        if (result.convertedImage) {
          downloadImage(result.convertedImage, result.finalFormat, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, result.finalFormat)
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, result.finalFormat)
          })
        } else {
          throw new Error('No converted image data available for download')
        }
        break

      case 'ocr-extraction':
        if (result.extractedText) {
          downloadText(result.extractedText, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'txt')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'txt')
          })
        } else {
          throw new Error('No extracted text data available for download')
        }
        break

      // Web Tools
      case 'html-to-markdown':
        if (result.markdown) {
          downloadText(result.markdown, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'md')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'md')
          })
        } else {
          throw new Error('No markdown data available for download')
        }
        break

      case 'text-extraction':
        if (result.extractedText) {
          downloadText(result.extractedText, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'txt')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'txt')
          })
        } else {
          throw new Error('No extracted text data available for download')
        }
        break

      case 'screenshot-tool':
        if (result.screenshot) {
          downloadImage(result.screenshot, 'png', {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'png')
          })
        } else if (result.downloadUrl) {
          downloadBlob(result.downloadUrl, {
            filename: getFinalFilename(customFilename, originalFilename, toolId, 'png')
          })
        } else {
          throw new Error('No screenshot data available for download')
        }
        break



      default:
        // Fallback: try to download as blob if possible
        if (result.downloadUrl && typeof result.downloadUrl === 'object') {
          if (result.downloadUrl.mergedPdf) {
            downloadPDF(result.downloadUrl.mergedPdf, {
              filename: getFinalFilename(customFilename, originalFilename, toolId, 'pdf')
            })
          } else if (result.downloadUrl.compressedPdf) {
            downloadPDF(result.downloadUrl.compressedPdf, {
              filename: getFinalFilename(customFilename, originalFilename, toolId, 'pdf')
            })
          } else if (result.downloadUrl.extractedPdf) {
            downloadPDF(result.downloadUrl.extractedPdf, {
              filename: getFinalFilename(customFilename, originalFilename, toolId, 'pdf')
            })
          } else if (result.downloadUrl.compressedImage) {
            downloadImage(result.downloadUrl.compressedImage, result.downloadUrl.finalFormat || 'png', {
              filename: getFinalFilename(customFilename, originalFilename, toolId, result.downloadUrl.finalFormat || 'png')
            })
          } else {
            throw new Error('Unsupported download format')
          }
        } else {
          throw new Error('No downloadable content found')
        }
    }
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}
