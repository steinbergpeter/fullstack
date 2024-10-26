import { z } from 'zod'

const paginationSchema = z.object({
  skip: z.number().int().min(0).optional(),
  take: z.number().int().min(1).max(20).optional(),
})

type PaginationParams = z.infer<typeof paginationSchema>

export { paginationSchema, type PaginationParams }
