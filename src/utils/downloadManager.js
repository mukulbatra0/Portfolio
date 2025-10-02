// Download manager utility

/**
 * Download manager for handling file downloads with progress tracking
 */
export class DownloadManager {
  constructor() {
    this.activeDownloads = new Map()
  }

  /**
   * Download a file with progress tracking
   * @param {string} url - File URL to download
   * @param {string} filename - Desired filename
   * @param {Function} onProgress - Progress callback (progress: number 0-100)
   * @param {Function} onComplete - Completion callback
   * @param {Function} onError - Error callback
   */
  async downloadFile(url, filename, onProgress, onComplete, onError) {
    const downloadId = `${url}-${Date.now()}`
    
    try {
      // Check if file exists first
      const headResponse = await fetch(url, { method: 'HEAD' })
      if (!headResponse.ok) {
        throw new Error(`File not found: ${headResponse.status}`)
      }

      const contentLength = headResponse.headers.get('content-length')
      const totalSize = contentLength ? parseInt(contentLength, 10) : 0

      // Start actual download
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('ReadableStream not supported')
      }

      const chunks = []
      let receivedLength = 0

      // Track download
      this.activeDownloads.set(downloadId, { url, filename, startTime: Date.now() })

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        chunks.push(value)
        receivedLength += value.length

        // Calculate and report progress
        if (totalSize > 0) {
          const progress = Math.round((receivedLength / totalSize) * 100)
          onProgress?.(progress)
        } else {
          // Indeterminate progress
          onProgress?.(Math.min(90, receivedLength / 10000))
        }
      }

      // Complete progress
      onProgress?.(100)

      // Create blob and download
      const blob = new Blob(chunks)
      const downloadUrl = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      URL.revokeObjectURL(downloadUrl)
      this.activeDownloads.delete(downloadId)
      
      onComplete?.({
        filename,
        size: receivedLength,
        duration: Date.now() - this.activeDownloads.get(downloadId)?.startTime || 0
      })

    } catch (error) {
      this.activeDownloads.delete(downloadId)
      onError?.(error)
    }
  }

  /**
   * Simple download without progress tracking
   * @param {string} url - File URL
   * @param {string} filename - Desired filename
   */
  async simpleDownload(url, filename) {
    return new Promise((resolve, reject) => {
      this.downloadFile(
        url,
        filename,
        null, // no progress tracking
        resolve,
        reject
      )
    })
  }

  /**
   * Cancel a download
   * @param {string} downloadId - Download ID to cancel
   */
  cancelDownload(downloadId) {
    if (this.activeDownloads.has(downloadId)) {
      this.activeDownloads.delete(downloadId)
      // Note: Actual cancellation would require AbortController
      // This is a simplified implementation
    }
  }

  /**
   * Get active downloads
   */
  getActiveDownloads() {
    return Array.from(this.activeDownloads.entries()).map(([id, info]) => ({
      id,
      ...info
    }))
  }

  /**
   * Check if a URL is downloadable
   * @param {string} url - URL to check
   */
  async isDownloadable(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }
}

// Create singleton instance
export const downloadManager = new DownloadManager()

/**
 * Utility function for quick downloads
 * @param {string} url - File URL
 * @param {string} filename - Desired filename
 * @param {Object} callbacks - Optional callbacks { onProgress, onComplete, onError }
 */
export const downloadFile = (url, filename, callbacks = {}) => {
  return downloadManager.downloadFile(
    url,
    filename,
    callbacks.onProgress,
    callbacks.onComplete,
    callbacks.onError
  )
}

/**
 * Get file extension from URL or filename
 * @param {string} urlOrFilename - URL or filename
 */
export const getFileExtension = (urlOrFilename) => {
  const parts = urlOrFilename.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate filename for download
 * @param {string} filename - Filename to validate
 */
export const validateFilename = (filename) => {
  // Remove invalid characters
  const sanitized = filename.replace(/[<>:"/\\|?*]/g, '_')
  
  // Ensure it's not empty
  return sanitized.trim() || 'download'
}

/**
 * Generate filename from URL
 * @param {string} url - URL to extract filename from
 */
export const getFilenameFromUrl = (url) => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop()
    return filename || 'download'
  } catch {
    return 'download'
  }
}

/**
 * Check if browser supports downloads
 */
export const supportsDownload = () => {
  const link = document.createElement('a')
  return typeof link.download !== 'undefined'
}

/**
 * Analytics helper for download tracking
 * @param {string} filename - Downloaded filename
 * @param {string} source - Download source/context
 */
export const trackDownload = (filename, source = 'unknown') => {
  // This would integrate with your analytics service
  console.log(`Download tracked: ${filename} from ${source}`)
  
  // Example: Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'file_download', {
      file_name: filename,
      source: source
    })
  }
  
  // Example: Custom analytics
  if (window.analytics) {
    window.analytics.track('File Downloaded', {
      filename,
      source,
      timestamp: new Date().toISOString()
    })
  }
}