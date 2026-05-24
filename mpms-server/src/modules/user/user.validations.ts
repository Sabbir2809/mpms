import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  department: z.string().max(100).optional(),
  skills: z.array(z.string().max(50)).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

const updateUserRoleSchema = z.object({
  role: z.enum(["admin", "manager", "member"]),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

const userQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional(),
  role: z.enum(["admin", "manager", "member"]).optional(),
  department: z.string().optional(),
  isActive: z.enum(["true", "false"]).optional(),
  sort: z.string().optional().default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const userValidations = {
  updateUserSchema,
  updateUserRoleSchema,
  updatePasswordSchema,
  userQuerySchema,
};

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
