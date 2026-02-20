/**
 * Retry utility for external API calls with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
}

export interface RetryResult<T> {
  success: boolean
  data?: T
  error?: string
  attempts: number
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 500,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error: any): boolean {
  // Network errors
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
    return true
  }

  // HTTP status codes that warrant retry
  if (error.status) {
    // 429 Too Many Requests, 500+ Server Errors
    return error.status === 429 || error.status >= 500
  }

  // Fetch errors
  if (error.name === 'FetchError' || error.name === 'AbortError') {
    return true
  }

  return false
}

/**
 * Execute an async function with retry logic and exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<RetryResult<T>> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let lastError: any
  let delay = opts.initialDelayMs

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      const data = await fn()
      return { success: true, data, attempts: attempt }
    } catch (error: any) {
      lastError = error
      console.error(`Attempt ${attempt}/${opts.maxRetries} failed:`, error.message || error)

      // Don't retry on non-retryable errors
      if (!isRetryableError(error)) {
        return {
          success: false,
          error: error.message || 'Non-retryable error occurred',
          attempts: attempt,
        }
      }

      // Don't wait after last attempt
      if (attempt < opts.maxRetries) {
        console.log(`Retrying in ${delay}ms...`)
        await sleep(delay)
        delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs)
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'All retry attempts failed',
    attempts: opts.maxRetries,
  }
}

/**
 * Check if external service is configured
 * Returns a result object instead of silently returning true
 */
export interface ServiceConfigResult {
  configured: boolean
  missingKeys?: string[]
}

export function checkServiceConfig(
  requiredEnvVars: string[]
): ServiceConfigResult {
  const missingKeys = requiredEnvVars.filter(
    (key) => !process.env[key] || process.env[key] === `your_${key.toLowerCase()}`
  )

  return {
    configured: missingKeys.length === 0,
    missingKeys: missingKeys.length > 0 ? missingKeys : undefined,
  }
}
