import http from 'node:http'
import { app } from './app.js'
import { env } from './config/env.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { logger } from './utils/logger.js'

async function startServer(): Promise<void> {
  // 1. Establish Database Connection
  try {
    await connectDatabase()
  } catch (err: unknown) {
    logger.error('Database connection error on startup:', err)
  }

  // 2. Start HTTP Listener
  const server = http.createServer(app)

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(
        `Port ${env.PORT} is already in use. Stop the other server using this port or set a different PORT in server/.env.`
      )
    } else {
      logger.error('HTTP server failed to start:', error)
    }

    void disconnectDatabase()
      .catch((shutdownError: unknown) => {
        logger.error('Failed to disconnect database after HTTP server startup error:', shutdownError)
      })
      .finally(() => process.exit(1))
  })

  server.listen(env.PORT, () => {
    logger.info(`====================================================`)
    logger.info(`AI Digital Twin API Server running in [${env.NODE_ENV}] mode`)
    logger.info(`Server listening on: http://localhost:${env.PORT}`)
    logger.info(`Health check: http://localhost:${env.PORT}/health`)
    logger.info(`Database health: http://localhost:${env.PORT}/health/db`)
    logger.info(`API v1 Gateway: http://localhost:${env.PORT}/api/v1`)
    logger.info(`Frontend Origin Allowed: ${env.FRONTEND_URL}`)
    logger.info(`====================================================`)
  })

  // 3. Graceful Shutdown Signals
  const handleShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Gracefully shutting down HTTP server...`)

    server.close(async () => {
      logger.info('HTTP server closed.')
      await disconnectDatabase()
      process.exit(0)
    })

    // Force exit after timeout if shutdown hangs
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout.')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', () => handleShutdown('SIGTERM'))
  process.on('SIGINT', () => handleShutdown('SIGINT'))
}

startServer().catch((error) => {
  logger.error('Fatal failure starting server:', error)
  process.exit(1)
})
