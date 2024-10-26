// src/app/api/user/[userId]/route.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { updateUserSchema, userResponseSchema } from '@/validation/users'
import { withErrorHandler } from '@/lib/withErrorHandler'
import { UserNotFoundError } from '@/lib/errors'
import type { UpdateUserType } from '@/validation/users'

// GET //
const fetchUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new UserNotFoundError()
  return userResponseSchema.parse(user)
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query
  const user = await fetchUserById(userId as string)
  res.status(200).json(user)
}

export const GET = withErrorHandler(handleGet)

// UPDATE //
const updateUser = async (id: string, data: UpdateUserType) => {
  const userExists = await prisma.user.findUnique({ where: { id } })
  if (!userExists) throw new UserNotFoundError()

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  })
  return userResponseSchema.parse(updatedUser)
}

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query
  const validatedData = updateUserSchema.parse(req.body) // Validation with Zod
  const user = await updateUser(userId as string, validatedData)
  res.status(200).json(user)
}

export const PUT = withErrorHandler(handlePut)

// DELETE //
const deleteUser = async (id: string) => {
  const userExists = await prisma.user.findUnique({ where: { id } })
  if (!userExists) throw new UserNotFoundError()

  await prisma.user.delete({ where: { id } })
  return { message: 'User deleted successfully' }
}

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query
  const result = await deleteUser(userId as string)
  res.status(200).json(result)
}

export const DELETE = withErrorHandler(handleDelete)
