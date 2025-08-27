export interface BackgroundRemovalOptions {
  tolerance: number // 0-100, how strict the background detection is
  featherEdges: boolean // Smooth the edges of the subject
  outputFormat: 'png' | 'jpg' | 'webp'
  quality: number // 1-100 for lossy formats
  preserveShadows: boolean // Keep subtle shadows around the subject
  autoEnhance: boolean // Automatically adjust contrast and brightness
}

export async function processBackgroundRemoval(
  files: File[],
  options: BackgroundRemovalOptions,
  progressTracker?: any
): Promise<any> {
  if (files.length === 0) {
    throw new Error('No files provided')
  }

  const results = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    if (progressTracker) {
      progressTracker.updateProgress(`Processing image ${i + 1}/${files.length}...`, (i * 80) / files.length)
    }

    try {
      const result = await removeBackgroundFromImage(file, options)
      results.push(result)
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error)
      results.push({
        success: false,
        fileName: file.name,
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  if (progressTracker) {
    progressTracker.updateProgress('Finalizing results...', 90)
  }

  // Combine results for multiple files
  if (results.length === 1) {
    return results[0]
  } else {
    return {
      success: true,
      results,
      totalFiles: files.length,
      successfulFiles: results.filter(r => r.success).length,
      downloadUrl: results.length === 1 ? results[0].downloadUrl : undefined
    }
  }
}

async function removeBackgroundFromImage(
  file: File, 
  options: BackgroundRemovalOptions
): Promise<any> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    img.onload = () => {
      try {
        // Set canvas size
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw original image
        ctx.drawImage(img, 0, 0)
        
        // Get image data for processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Detect background and create mask
        const mask = detectBackground(data, canvas.width, canvas.height, options)
        
        // Apply mask to create transparent background
        const processedData = applyMask(imageData, mask, options)
        
        // Put processed data back to canvas
        ctx.putImageData(processedData, 0, 0)
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const downloadUrl = URL.createObjectURL(blob)
              resolve({
                success: true,
                fileName: file.name,
                originalSize: file.size,
                finalSize: blob.size,
                downloadUrl,
                dimensions: {
                  width: canvas.width,
                  height: canvas.height
                },
                metadata: {
                  tolerance: options.tolerance,
                  featherEdges: options.featherEdges,
                  outputFormat: options.outputFormat,
                  quality: options.quality
                }
              })
            } else {
              reject(new Error('Failed to create blob'))
            }
          },
          `image/${options.outputFormat}`,
          options.outputFormat === 'jpg' ? options.quality / 100 : 1
        )
        
      } catch (error) {
        reject(new Error(`Image processing failed: ${error instanceof Error ? error.message : String(error)}`))
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    // Load image from file
    img.src = URL.createObjectURL(file)
  })
}

function detectBackground(
  data: Uint8ClampedArray, 
  width: number, 
  height: number, 
  options: BackgroundRemovalOptions
): Uint8Array {
  const mask = new Uint8Array(width * height)
  const tolerance = options.tolerance / 100 // Convert to 0-1 range
  
  // Simple background detection based on edge detection and color analysis
  // This is a simplified version - production would use more sophisticated algorithms
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const a = data[idx + 3]
      
      // Skip transparent pixels
      if (a === 0) {
        mask[y * width + x] = 0
        continue
      }
      
      // Calculate brightness and saturation
      const brightness = (r + g + b) / 3
      const maxColor = Math.max(r, g, b)
      const minColor = Math.min(r, g, b)
      const saturation = maxColor === 0 ? 0 : (maxColor - minColor) / maxColor
      
      // Background detection logic
      let isBackground = false
      
      // Check if pixel is near edges (likely background)
      const isEdge = x < 5 || x > width - 5 || y < 5 || y > height - 5
      
      // Check for very bright or very dark pixels (likely background)
      const isExtremeBrightness = brightness > 240 || brightness < 15
      
      // Check for low saturation (likely background)
      const isLowSaturation = saturation < 0.1
      
      // Check for uniform color areas
      const isUniformColor = checkUniformColor(data, x, y, width, height, tolerance)
      
      if (isEdge || isExtremeBrightness || isLowSaturation || isUniformColor) {
        isBackground = true
      }
      
      // Apply tolerance
      if (isBackground) {
        const confidence = calculateBackgroundConfidence(
          brightness, saturation, isEdge, isUniformColor
        )
        mask[y * width + x] = confidence > tolerance ? 0 : 255
      } else {
        mask[y * width + x] = 255
      }
    }
  }
  
  // Apply edge feathering if requested
  if (options.featherEdges) {
    featherMask(mask, width, height)
  }
  
  return mask
}

function checkUniformColor(
  data: Uint8ClampedArray, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  tolerance: number
): boolean {
  const radius = 3
  const centerIdx = (y * width + x) * 4
  const centerR = data[centerIdx]
  const centerG = data[centerIdx + 1]
  const centerB = data[centerIdx + 2]
  
  let similarPixels = 0
  let totalPixels = 0
  
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = x + dx
      const ny = y + dy
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const idx = (ny * width + nx) * 4
        const r = data[idx]
        const g = data[idx + 1]
        const b = data[idx + 2]
        
        const colorDiff = Math.sqrt(
          Math.pow(r - centerR, 2) + 
          Math.pow(g - centerG, 2) + 
          Math.pow(b - centerB, 2)
        )
        
        if (colorDiff < 30) { // Threshold for similar colors
          similarPixels++
        }
        totalPixels++
      }
    }
  }
  
  return similarPixels / totalPixels > (1 - tolerance)
}

function calculateBackgroundConfidence(
  brightness: number, 
  saturation: number, 
  isEdge: boolean, 
  isUniformColor: boolean
): number {
  let confidence = 0
  
  // Edge confidence
  if (isEdge) confidence += 0.4
  
  // Brightness confidence
  if (brightness > 240 || brightness < 15) confidence += 0.3
  
  // Saturation confidence
  if (saturation < 0.1) confidence += 0.2
  
  // Uniform color confidence
  if (isUniformColor) confidence += 0.1
  
  return Math.min(confidence, 1.0)
}

function featherMask(mask: Uint8Array, width: number, height: number): void {
  const feathered = new Uint8Array(mask)
  const radius = 2
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      let count = 0
      
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx
          const ny = y + dy
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            sum += mask[ny * width + nx]
            count++
          }
        }
      }
      
      feathered[y * width + x] = sum / count
    }
  }
  
  // Copy feathered result back
  mask.set(feathered)
}

function applyMask(
  imageData: ImageData, 
  mask: Uint8Array, 
  options: BackgroundRemovalOptions
): ImageData {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const maskValue = mask[y * width + x] / 255
      
      // Apply mask to alpha channel
      data[idx + 3] = Math.round(data[idx + 3] * maskValue)
      
      // Enhance edges if feathering is enabled
      if (options.featherEdges && maskValue > 0 && maskValue < 1) {
        // Slightly enhance contrast for edge pixels
        const factor = 1 + (1 - maskValue) * 0.2
        data[idx] = Math.min(255, Math.round(data[idx] * factor))
        data[idx + 1] = Math.min(255, Math.round(data[idx + 1] * factor))
        data[idx + 2] = Math.min(255, Math.round(data[idx + 2] * factor))
      }
    }
  }
  
  return imageData
}
