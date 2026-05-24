import { z } from "zod";

const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(5000),
  parentComment: z.string().optional(),
  mentions: z.array(z.string()).optional().default([]),
});

const updateCommentSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const commentValidations = {
  createCommentSchema,
  updateCommentSchema,
};

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
