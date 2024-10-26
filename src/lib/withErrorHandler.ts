// src/lib/withErrorHandler.ts
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { ZodError } from 'zod'
import { UserNotFoundError } from './errors'

export const withErrorHandler =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return res.status(404).json({ message: error.message })
      }
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: 'Validation error', errors: error.errors })
      }
      console.error(error)
      return res.status(500).json({ message: 'An unexpected error occurred' })
    }
  }
