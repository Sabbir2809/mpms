import { z } from "zod";

const attachmentParamsSchema = z.object({
  projectId: z.string().min(1),
  taskId: z.string().min(1),
});

const attachmentIdSchema = z.object({
  attachmentId: z.string().min(1),
});

export const attachmentValidations = {
  attachmentParamsSchema,
  attachmentIdSchema,
};

export type AttachmentParamsInput = z.infer<typeof attachmentParamsSchema>;
