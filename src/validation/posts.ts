// src/validation/posts.ts
import { z } from 'zod'
import { basicUserSchema } from './users'
import { commentResponseSchema } from './comments' // Import comment schema
import { paginationSchema } from './misc' // Reuse pagination schema

// Schema for creating a new post
export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  published: z.boolean().optional(),
  authorId: z.string(), // Required to link the post to the author
})

// Schema for updating an existing post
export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
})

// Schema for a single post with nested comments
export const postResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullable(),
  published: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: basicUserSchema, // Minimal author details using basicUserSchema
  comments: z.array(commentResponseSchema).optional(), // Reuse comment schema here
})

// Schema for multiple posts (array of postResponseSchema)
export const postsResponseSchema = z.array(postResponseSchema)

// Type definitions for schemas
export type CreatePostType = z.infer<typeof createPostSchema>
export type UpdatePostType = z.infer<typeof updatePostSchema>
export type PostResponseType = z.infer<typeof postResponseSchema>
export type PostsResponseType = z.infer<typeof postsResponseSchema>
export type PaginationParams = z.infer<typeof paginationSchema>
