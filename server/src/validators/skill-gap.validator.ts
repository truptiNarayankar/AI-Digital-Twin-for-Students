import { z } from 'zod'
import { LearningStageStatus } from '../types/index.js'

export const analyzeSkillGapSchema = z.object({
  body: z.object({
    targetRole: z.string().trim().min(2, 'Target role must be at least 2 characters').max(120).optional(),
  }),
})

export const generateLearningPathSchema = z.object({
  body: z.object({
    skillGapAnalysisId: z.string().trim().optional(),
  }),
})

export const updateStageProgressSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, 'Learning path ID is required'),
    stageNumber: z.string().regex(/^\d+$/, 'Stage number must be a valid integer'),
  }),
  body: z.object({
    status: z.nativeEnum(LearningStageStatus).optional(),
    progress: z.number().min(0, 'Progress cannot be negative').max(100, 'Progress cannot exceed 100').optional(),
  }),
})
