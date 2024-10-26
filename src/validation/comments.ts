// src/validation/comments.ts
import { z } from 'zod'
import { basicUserSchema } from './users'
import { paginationSchema } from './misc' // Updated import

// Schema for creating a new comment
export const createCommentSchema = z.object({
  content: z.string().min(1), // Required content field
  authorId: z.string(), // Required to link the comment to the author
  postId: z.string(), // Required to link the comment to the post
})

// Schema for updating an existing comment
export const updateCommentSchema = z.object({
  content: z.string().min(1).optional(), // Optional content field for updates
})

// Schema for a single comment with author information
export const commentResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: basicUserSchema, // Minimal author details using basicUserSchema
})

// Schema for multiple comments (array of commentResponseSchema)
export const commentsResponseSchema = z.array(commentResponseSchema)

// Type definitions for the schemas
export type CreateCommentType = z.infer<typeof createCommentSchema>
export type UpdateCommentType = z.infer<typeof updateCommentSchema>
export type CommentResponseType = z.infer<typeof commentResponseSchema>
export type CommentsResponseType = z.infer<typeof commentsResponseSchema>
export type PaginationParams = z.infer<typeof paginationSchema> // Updated type
