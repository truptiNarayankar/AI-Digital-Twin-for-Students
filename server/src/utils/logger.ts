// Development & Production friendly logger

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    return `${prefix} ${message}`
  }

  info(message: string, ...meta: unknown[]): void {
    console.log(this.formatMessage('info', message), ...meta)
  }

  warn(message: string, ...meta: unknown[]): void {
    console.warn(this.formatMessage('warn', message), ...meta)
  }

  error(message: string, ...meta: unknown[]): void {
    console.error(this.formatMessage('error', message), ...meta)
  }

  debug(message: string, ...meta: unknown[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message), ...meta)
    }
  }
}

export const logger = new Logger()
