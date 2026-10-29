import { z } from 'zod'

export const assessPlacementSchema = z.object({
  body: z.object({
    targetRole: z
      .string()
      .trim()
      .min(2, 'Target role must be at least 2 characters')
      .max(120, 'Target role cannot exceed 120 characters')
      .optional(),
    forceRefresh: z.boolean().optional(),
  }),
})

export type AssessPlacementInput = z.infer<typeof assessPlacementSchema>
