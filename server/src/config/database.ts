import mongoose from 'mongoose'
import { env } from './env.js'
import { logger } from '../utils/logger.js'

// Safe helper to mask credentials in MongoDB URIs for logging
function maskMongoUri(uri: string): string {
  try {
    const url = new URL(uri)
    if (url.password) {
      url.password = '****'
    }
    return url.toString()
  } catch {
    // If not a standard URL (e.g. simple string), sanitize user:pass
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')
  }
}

export async function connectDatabase(): Promise<typeof mongoose | null> {
  const maskedUri = maskMongoUri(env.MONGODB_URI)

  try {
    logger.info(`Attempting MongoDB connection to ${maskedUri}...`)

    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    })

    logger.info(`MongoDB connected successfully [Host: ${conn.connection.host}, DB: ${conn.connection.name}]`)

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB runtime connection error:', err.message || err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB connection re-established')
    })

    return conn
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`MongoDB connection failed (${maskedUri}): ${errorMessage}`)

    // In production or when strictly required, throw error
    if (env.isProduction) {
      throw new Error(`Critical: Unable to connect to MongoDB in production: ${errorMessage}`)
    }

    return null
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1
}

export function getDatabaseStatus(): {
  connected: boolean
  readyState: number
  statusName: string
} {
  const state = mongoose.connection.readyState
  const statusNames: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  return {
    connected: state === 1,
    readyState: state,
    statusName: statusNames[state] || 'unknown',
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    logger.info('MongoDB disconnected gracefully')
  }
}
