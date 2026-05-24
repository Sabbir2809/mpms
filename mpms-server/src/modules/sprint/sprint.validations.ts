import { z } from "zod";

export const createSprintSchema = z
  .object({
    name: z.string().min(1, "Sprint name is required").max(200),
    goal: z.string().max(1000).optional().default(""),
    startDate: z.string().datetime({ offset: true }).or(z.string().date()),
    endDate: z.string().datetime({ offset: true }).or(z.string().date()),
    status: z
      .enum(["planning", "active", "completed", "cancelled"])
      .optional()
      .default("planning"),
    order: z.number().int().min(0).optional(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const updateSprintSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  goal: z.string().max(1000).optional(),
  startDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional(),
  endDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().date())
    .optional(),
  status: z.enum(["planning", "active", "completed", "cancelled"]).optional(),
  order: z.number().int().min(0).optional(),
});

export const reorderSprintsSchema = z.object({
  sprints: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    }),
  ),
});

export const sprintValidations = {
  createSprintSchema,
  updateSprintSchema,
  reorderSprintsSchema,
};

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
export type ReorderSprintsInput = z.infer<typeof reorderSprintsSchema>;
