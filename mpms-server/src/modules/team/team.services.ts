import { Types } from "mongoose";
import { AppError } from "../../utils/appError";
import { Project } from "../project/project.model";
import { User } from "../user/user.model";
import { ITeamMember } from "./team.interface";
import { TeamMember } from "./team.model";
import { AddTeamMemberInput, UpdateTeamMemberInput } from "./team.validations";

const getTeamByProject = async (projectId: string): Promise<ITeamMember[]> => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError("Project not found", 404);

  return TeamMember.find({ project: projectId })
    .populate("user", "name email avatar role department skills isActive")
    .populate("addedBy", "name email")
    .sort({ joinedAt: -1 });
};

const addTeamMember = async (
  projectId: string,
  input: AddTeamMemberInput,
  requesterId: string,
): Promise<ITeamMember> => {
  const [project, user] = await Promise.all([
    Project.findById(projectId),
    User.findById(input.userId),
  ]);

  if (!project) throw new AppError("Project not found", 404);
  if (!user) throw new AppError("User not found", 404);

  const existing = await TeamMember.findOne({
    user: input.userId,
    project: projectId,
  });
  if (existing) throw new AppError("User is already a team member", 409);

  await Project.findByIdAndUpdate(projectId, {
    $addToSet: { members: new Types.ObjectId(input.userId) },
  });

  const member = await TeamMember.create({
    user: new Types.ObjectId(input.userId),
    project: new Types.ObjectId(projectId),
    role: input.role,
    addedBy: new Types.ObjectId(requesterId),
  });

  return member.populate([
    { path: "user", select: "name email avatar role department skills" },
    { path: "addedBy", select: "name email" },
  ]);
};

const updateTeamMember = async (
  projectId: string,
  memberId: string,
  input: UpdateTeamMemberInput,
): Promise<ITeamMember> => {
  const member = await TeamMember.findOneAndUpdate(
    { _id: memberId, project: projectId },
    { role: input.role },
    { new: true },
  ).populate("user", "name email avatar role department skills");

  if (!member) throw new AppError("Team member not found", 404);
  return member;
};

const removeTeamMember = async (
  projectId: string,
  memberId: string,
): Promise<void> => {
  const member = await TeamMember.findOne({
    _id: memberId,
    project: projectId,
  });
  if (!member) throw new AppError("Team member not found", 404);

  await Promise.all([
    TeamMember.findByIdAndDelete(memberId),
    Project.findByIdAndUpdate(projectId, {
      $pull: { members: member.user },
    }),
  ]);
};

export const teamServices = {
  getTeamByProject,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
};
