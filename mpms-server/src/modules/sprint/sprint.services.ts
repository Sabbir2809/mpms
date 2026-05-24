import { Types } from "mongoose";
import { AppError } from "../../utils/appError";
import { Project } from "../project/project.model";
import { ISprint, SprintStatus } from "./sprint.interface";
import { Sprint } from "./sprint.model";
import {
  CreateSprintInput,
  ReorderSprintsInput,
  UpdateSprintInput,
} from "./sprint.validations";

const createSprint = async (
  projectId: string,
  input: CreateSprintInput,
  userId: string,
): Promise<ISprint> => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const lastSprint = await Sprint.findOne({ project: projectId })
    .sort({ sprintNumber: -1 })
    .select("sprintNumber order");

  const sprintNumber = (lastSprint?.sprintNumber || 0) + 1;
  const order = (lastSprint?.order || 0) + 1;

  const sprint = await Sprint.create({
    ...input,
    project: new Types.ObjectId(projectId),
    sprintNumber,
    order: input.order !== undefined ? input.order : order,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    status: input.status as SprintStatus,
    createdBy: new Types.ObjectId(userId),
  });

  return sprint.populate("createdBy", "name email avatar");
};

const getSprintsByProject = async (projectId: string): Promise<ISprint[]> => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return Sprint.find({ project: projectId })
    .populate("createdBy", "name email avatar")
    .populate("taskCount")
    .sort({ order: 1, sprintNumber: 1 });
};

const getSprintById = async (
  projectId: string,
  sprintId: string,
): Promise<ISprint> => {
  const sprint = await Sprint.findOne({ _id: sprintId, project: projectId })
    .populate("createdBy", "name email avatar")
    .populate("taskCount");

  if (!sprint) {
    throw new AppError("Sprint not found", 404);
  }
  return sprint;
};

const updateSprint = async (
  projectId: string,
  sprintId: string,
  input: UpdateSprintInput,
): Promise<ISprint> => {
  const updateData: Record<string, unknown> = { ...input };
  if (input.startDate) updateData.startDate = new Date(input.startDate);
  if (input.endDate) updateData.endDate = new Date(input.endDate);
  if (input.status) updateData.status = input.status as SprintStatus;

  const sprint = await Sprint.findOneAndUpdate(
    { _id: sprintId, project: projectId },
    updateData,
    { new: true, runValidators: true },
  ).populate("createdBy", "name email avatar");

  if (!sprint) {
    throw new AppError("Sprint not found", 404);
  }
  return sprint;
};

const deleteSprint = async (
  projectId: string,
  sprintId: string,
): Promise<void> => {
  const sprint = await Sprint.findOneAndDelete({
    _id: sprintId,
    project: projectId,
  });
  if (!sprint) {
    throw new AppError("Sprint not found", 404);
  }
};

const reorderSprints = async (
  projectId: string,
  input: ReorderSprintsInput,
): Promise<ISprint[]> => {
  const bulkOps = input.sprints.map(({ id, order }) => ({
    updateOne: {
      filter: {
        _id: new Types.ObjectId(id),
        project: new Types.ObjectId(projectId),
      },
      update: { $set: { order } },
    },
  }));

  await Sprint.bulkWrite(bulkOps);

  return Sprint.find({ project: projectId })
    .sort({ order: 1 })
    .populate("createdBy", "name email avatar");
};

export const sprintServices = {
  createSprint,
  getSprintsByProject,
  getSprintById,
  updateSprint,
  deleteSprint,
  reorderSprints,
};
