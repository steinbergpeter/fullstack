// src/validation/users.ts
import { z } from 'zod'
import { postResponseSchema } from './posts' // Import from posts
import { paginationSchema } from './misc'

export const basicUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
})

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  image: z.string().url().optional(),
})

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  image: z.string().url().optional(),
})

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  following: z.array(basicUserSchema).optional(),
  followers: z.array(basicUserSchema).optional(),
})

export const userWithPostsSchema = userResponseSchema.extend({
  posts: z.array(postResponseSchema).optional(),
})

export type CreateUserType = z.infer<typeof createUserSchema>
export type UpdateUserType = z.infer<typeof updateUserSchema>
export type UserResponseType = z.infer<typeof userResponseSchema>
export type UserWithPostsType = z.infer<typeof userWithPostsSchema>
export type PaginationParams = z.infer<typeof paginationSchema>
