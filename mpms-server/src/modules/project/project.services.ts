import { FilterQuery, Types } from "mongoose";
import { PaginationResult, ProjectStatus } from "../../types";
import { AppError } from "../../utils/appError";
import { IProject } from "./project.interface";
import { Project } from "./project.model";
import {
  CreateProjectInput,
  ProjectQueryInput,
  UpdateProjectInput,
} from "./project.validations";

interface ProjectsResult {
  projects: IProject[];
  pagination: PaginationResult;
}

const createProject = async (
  input: CreateProjectInput,
  userId: string,
): Promise<IProject> => {
  const memberIds = (input.members || []).map((id) => new Types.ObjectId(id));

  const project = await Project.create({
    ...input,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    status: input.status as ProjectStatus,
    createdBy: new Types.ObjectId(userId),
    members: memberIds,
  });

  return project.populate(["createdBy", "members"]);
};

const getProjects = async (
  query: ProjectQueryInput,
): Promise<ProjectsResult> => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const skip = (page - 1) * limit;

  const filter: FilterQuery<IProject> = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.status) filter.status = query.status;
  if (query.client) filter.client = { $regex: query.client, $options: "i" };

  if (query.startDate) {
    filter.startDate = { $gte: new Date(query.startDate) };
  }
  if (query.endDate) {
    filter.endDate = { $lte: new Date(query.endDate) };
  }

  const sortField = query.sort || "createdAt";
  const sortOrder = query.order === "asc" ? 1 : -1;

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate("createdBy", "name email avatar")
      .populate("members", "name email avatar role")
      .populate("sprintCount")
      .populate("taskCount")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filter),
  ]);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProjectById = async (id: string): Promise<IProject> => {
  const project = await Project.findById(id)
    .populate("createdBy", "name email avatar role")
    .populate("members", "name email avatar role department skills");

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

const updateProject = async (
  id: string,
  input: UpdateProjectInput,
  userId: string,
): Promise<IProject> => {
  const project = await Project.findById(id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const updateData: Record<string, unknown> = { ...input };

  if (input.startDate) updateData.startDate = new Date(input.startDate);
  if (input.endDate) updateData.endDate = new Date(input.endDate);
  if (input.status) updateData.status = input.status as ProjectStatus;
  if (input.members) {
    updateData.members = input.members.map((id) => new Types.ObjectId(id));
  }

  const updated = await Project.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("createdBy", "name email avatar")
    .populate("members", "name email avatar role");

  if (!updated) {
    throw new AppError("Project not found", 404);
  }

  return updated;
};

const deleteProject = async (id: string): Promise<void> => {
  const project = await Project.findByIdAndDelete(id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }
};

const addProjectMember = async (
  projectId: string,
  memberId: string,
): Promise<IProject> => {
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { members: new Types.ObjectId(memberId) } },
    { new: true },
  ).populate("members", "name email avatar role");

  if (!project) {
    throw new AppError("Project not found", 404);
  }
  return project;
};

const removeProjectMember = async (
  projectId: string,
  memberId: string,
): Promise<IProject> => {
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $pull: { members: new Types.ObjectId(memberId) } },
    { new: true },
  ).populate("members", "name email avatar role");

  if (!project) {
    throw new AppError("Project not found", 404);
  }
  return project;
};

export const projectServices = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
};
