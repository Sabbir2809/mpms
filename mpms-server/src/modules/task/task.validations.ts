import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(500),
  description: z.string().max(10000).optional().default(""),
  sprint: z.string().optional(),
  assignees: z.array(z.string()).optional().default([]),
  estimateHours: z.number().min(0).optional().default(0),
  priority: z
    .enum(["low", "medium", "high", "urgent"])
    .optional()
    .default("medium"),
  status: z
    .enum(["todo", "in_progress", "review", "done"])
    .optional()
    .default("todo"),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional(),
  tags: z.array(z.string().max(50)).optional().default([]),
  order: z.number().int().min(0).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(3).max(500).optional(),
  description: z.string().max(10000).optional(),
  sprint: z.string().nullable().optional(),
  assignees: z.array(z.string()).optional(),
  estimateHours: z.number().min(0).optional(),
  loggedHours: z.number().min(0).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .nullable()
    .optional(),
  tags: z.array(z.string().max(50)).optional(),
  order: z.number().int().min(0).optional(),
});

const updateTaskStatusSchema = z.object({
  status: z.enum(["todo", "in_progress", "review", "done"]),
});

const addSubtaskSchema = z.object({
  title: z.string().min(1, "Subtask title is required").max(500),
});

const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  isCompleted: z.boolean().optional(),
});

const taskQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("20"),
  search: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  sprint: z.string().optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  sort: z.string().optional().default("order"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  tags: z.string().optional(),
});

const logHoursSchema = z.object({
  hours: z
    .number()
    .min(0.25, "Minimum log is 15 minutes")
    .max(24, "Cannot log more than 24 hours at once"),
});

export const taskValidations = {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  addSubtaskSchema,
  updateSubtaskSchema,
  taskQuerySchema,
  logHoursSchema,
};

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type AddSubtaskInput = z.infer<typeof addSubtaskSchema>;
export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
export type LogHoursInput = z.infer<typeof logHoursSchema>;
