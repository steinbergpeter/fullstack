// src/app/api/users/route.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/prisma'
import {
  createUserSchema,
  updateUserSchema,
  userWithPostsSchema,
  usersResponseSchema,
} from '@/validation/users'
import { withErrorHandler } from '@/lib/withErrorHandler'
import { paginationSchema } from '@/validation/misc'
import type {
  CreateUserType,
  UpdateUserType,
  PaginationParams,
} from '@/validation/users'

// Fetch paginated followed users with posts and comments
const fetchFollowingWithPagination = async (
  userId: string,
  params: PaginationParams
) => {
  const { skip = 0, take = 20 } = params

  const following = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      following: {
        take,
        skip,
        orderBy: { updatedAt: 'desc' },
        include: {
          posts: {
            take: 10,
            orderBy: { updatedAt: 'desc' },
            include: {
              comments: {
                take: 10,
                orderBy: { updatedAt: 'desc' },
                include: { author: true },
              },
              author: true,
            },
          },
        },
      },
    },
  })

  // Validate and return the response
  return usersResponseSchema.parse(following?.following || [])
}

// Create a new user
const createUser = async (data: CreateUserType) => {
  const user = await prisma.user.create({ data })
  return user
}

// Update an existing user
const updateUser = async (id: string, data: UpdateUserType) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  })
  return updatedUser
}

// GET handler to fetch paginated followed users
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.query.userId as string // Replace with authenticated user ID if needed
  const paginationParams = paginationSchema.parse(req.query)

  const followingUsers = await fetchFollowingWithPagination(
    userId,
    paginationParams
  )
  res.status(200).json(followingUsers)
}

// POST handler for creating a new user
const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const validatedData = createUserSchema.parse(req.body)
  const user = await createUser(validatedData)
  res.status(201).json(user)
}

// PUT handler for updating an existing user
const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query
  const validatedData = updateUserSchema.parse(req.body)
  const user = await updateUser(userId as string, validatedData)
  res.status(200).json(user)
}

// DELETE handler for deleting a user by ID
const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query
  await prisma.user.delete({ where: { id: userId as string } })
  res.status(200).json({ message: 'User deleted successfully' })
}

// Export the route handlers with error handling
export const GET = withErrorHandler(handleGet)
export const POST = withErrorHandler(handlePost)
export const PUT = withErrorHandler(handlePut)
export const DELETE = withErrorHandler(handleDelete)
