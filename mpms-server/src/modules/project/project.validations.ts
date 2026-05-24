import { z } from "zod";

const createProjectSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    client: z.string().min(1, "Client name is required").max(200),
    description: z.string().max(5000).optional().default(""),
    startDate: z.string().datetime({ offset: true }).or(z.string().date()),
    endDate: z.string().datetime({ offset: true }).or(z.string().date()),
    budget: z.number().min(0, "Budget cannot be negative"),
    status: z
      .enum(["planned", "active", "completed", "archived"])
      .optional()
      .default("planned"),
    members: z.array(z.string()).optional().default([]),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

const updateProjectSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  client: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
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
  budget: z.number().min(0).optional(),
  status: z.enum(["planned", "active", "completed", "archived"]).optional(),
  members: z.array(z.string()).optional(),
});

const projectQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional(),
  status: z.enum(["planned", "active", "completed", "archived"]).optional(),
  client: z.string().optional(),
  sort: z.string().optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const projectValidations = {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
};

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
