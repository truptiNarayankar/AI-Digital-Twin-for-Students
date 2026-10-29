import express, { type Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import { appRoutes } from './routes/index.js'
import { notFoundHandler } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

export function createApp(): Application {
  const app: Application = express()

  const configuredOrigins = (env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  const allowedOrigins = new Set([
    ...configuredOrigins,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
  ])

  // 1. Security Headers via Helmet
  app.use(helmet())

  // 2. Cross-Origin Resource Sharing (CORS) configured with FRONTEND_URL
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1):517\d+$/.test(origin)) {
          callback(null, true)
          return
        }

        callback(new Error(`Origin ${origin} not allowed by CORS`))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  )

  // 3. HTTP Request Logging (Sanitized, omitting passwords/tokens)
  app.use(
    morgan(env.isDevelopment ? 'dev' : 'combined', {
      skip: (req) => req.url === '/health',
    })
  )

  // 4. Request Body & Cookie Parsers
  app.use(cookieParser())
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // 5. Application Routes
  app.use(appRoutes)

  // 6. 404 Not Found Handler for unmatched routes
  app.use(notFoundHandler)

  // 7. Centralized Global Error Handler
  app.use(errorHandler)

  return app
}

export const app = createApp()
