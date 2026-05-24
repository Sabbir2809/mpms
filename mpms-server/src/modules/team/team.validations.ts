import { z } from "zod";

const addTeamMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["admin", "manager", "member"]).optional().default("member"),
});

const updateTeamMemberSchema = z.object({
  role: z.enum(["admin", "manager", "member"]),
});

export const teamValidations = {
  addTeamMemberSchema,
  updateTeamMemberSchema,
};

export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
