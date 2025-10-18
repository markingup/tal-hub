/**
 * Logger Utility
 * 
 * Follows UNIX principles:
 * - Single responsibility: Handle all application logging
 * - Rule of Silence: Minimal logging in production, detailed in development
 * - Text as Interface: Structured, readable log messages
 * 
 * Features:
 * - Environment-aware logging levels
 * - Structured error logging
 * - Development vs production behavior
 * - Integration-ready for external logging services
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  component?: string
  action?: string
  userId?: string
  caseId?: string
  [key: string]: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) {
      return true // Log everything in development
    }
    
    if (this.isProduction) {
      // In production, only log warnings and errors
      return level === 'warn' || level === 'error'
    }
    
    return true
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context))
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context))
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorContext = {
        ...context,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
        } : error,
      }
      console.error(this.formatMessage('error', message, errorContext))
    }
  }

  // Convenience methods for common patterns
  componentError(component: string, action: string, error: Error | unknown, context?: LogContext): void {
    this.error(`Component error in ${component} during ${action}`, error, {
      component,
      action,
      ...context,
    })
  }

  apiError(endpoint: string, method: string, error: Error | unknown, context?: LogContext): void {
    this.error(`API error: ${method} ${endpoint}`, error, {
      endpoint,
      method,
      ...context,
    })
  }

  userAction(userId: string, action: string, context?: LogContext): void {
    this.info(`User action: ${action}`, {
      userId,
      action,
      ...context,
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types for use in other files
export type { LogContext }
