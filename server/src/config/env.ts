import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

// Ensure .env is loaded from server directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/student_placement_twin'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  // Phase 7: AI Resume Analyzer & Gemini Configuration
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-3.6-flash'),
  MAX_RESUME_SIZE_MB: z.string().transform((val) => parseInt(val, 10)).default('10'),
  RESUME_UPLOAD_DIR: z.string().default('uploads/resumes'),
  // Phase 4 Authentication & JWT Secrets
  JWT_SECRET: z.string().default('ai-digital-twin-dev-secret-change-in-production-min32chars!'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().default('ai-digital-twin-dev-refresh-secret-change-in-production!'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format())
  process.exit(1)
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  isDevelopment: parsed.data.NODE_ENV === 'development',
  isTest: parsed.data.NODE_ENV === 'test',
}
