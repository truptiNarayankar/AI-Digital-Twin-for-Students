import fs from 'node:fs/promises'
import path from 'node:path'
import { env } from '../config/env.js'

export interface StoredFileInfo {
  fileName: string
  originalFileName: string
  storagePath: string
  fileUrl: string
  fileSize: number
  fileType: string
}

export interface IStorageProvider {
  saveFile(
    fileBuffer: Buffer,
    originalFileName: string,
    mimeType: string,
    studentId: string
  ): Promise<StoredFileInfo>
  deleteFile(storagePath: string): Promise<void>
  getFileBuffer(storagePath: string): Promise<Buffer>
}

/**
 * Sanitizes a filename to prevent path traversal and shell execution risks.
 */
export function sanitizeFileName(name: string): string {
  // Strip null bytes and path separators
  const base = path.basename(name).replace(/\0/g, '')
  // Replace unsafe characters with underscores, keeping alphanumeric, dots, hyphens, underscores
  const clean = base.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  return clean.slice(0, 100) // cap length
}

export class LocalStorageProvider implements IStorageProvider {
  private baseDir: string

  constructor(customDir?: string) {
    this.baseDir = path.resolve(process.cwd(), customDir || env.RESUME_UPLOAD_DIR)
  }

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.baseDir, { recursive: true })
  }

  async saveFile(
    fileBuffer: Buffer,
    originalFileName: string,
    mimeType: string,
    studentId: string
  ): Promise<StoredFileInfo> {
    await this.ensureDir()

    const sanitizedBase = sanitizeFileName(originalFileName)
    const uniqueFileName = `resume_${studentId}_${Date.now()}_${sanitizedBase}`
    const storagePath = path.join(this.baseDir, uniqueFileName)

    // Security check: ensure path is within baseDir
    const resolvedPath = path.resolve(storagePath)
    if (!resolvedPath.startsWith(path.resolve(this.baseDir))) {
      throw new Error('Invalid storage path detected: potential path traversal')
    }

    await fs.writeFile(storagePath, fileBuffer)

    return {
      fileName: uniqueFileName,
      originalFileName: sanitizedBase,
      storagePath,
      fileUrl: `/uploads/resumes/${uniqueFileName}`,
      fileSize: fileBuffer.length,
      fileType: mimeType,
    }
  }

  async deleteFile(storagePath: string): Promise<void> {
    try {
      const resolvedPath = path.resolve(storagePath)
      // Safety check: only delete within baseDir
      if (resolvedPath.startsWith(path.resolve(this.baseDir))) {
        await fs.unlink(resolvedPath)
      }
    } catch (err: unknown) {
      // If file doesn't exist, ignore ENOENT
      const error = err as { code?: string }
      if (error.code !== 'ENOENT') {
        console.warn(`[StorageService] Failed to delete file at ${storagePath}:`, err)
      }
    }
  }

  async getFileBuffer(storagePath: string): Promise<Buffer> {
    const resolvedPath = path.resolve(storagePath)
    if (!resolvedPath.startsWith(path.resolve(this.baseDir))) {
      throw new Error('Access denied: file outside storage directory')
    }
    return await fs.readFile(resolvedPath)
  }
}

export const storageService: IStorageProvider = new LocalStorageProvider()
