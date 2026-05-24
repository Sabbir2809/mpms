import { Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { p } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { projectServices } from "./project.services";
import {
  CreateProjectInput,
  ProjectQueryInput,
  UpdateProjectInput,
} from "./project.validations";

const create = catchAsync(async (req: AuthRequest, res: Response) => {
  const project = await projectServices.createProject(
    req.body as CreateProjectInput,
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await projectServices.getProjects(
    req.query as unknown as ProjectQueryInput,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Projects retrieved successfully",
    data: result.projects,
    meta: result.pagination,
  });
});

const getOne = catchAsync(async (req: AuthRequest, res: Response) => {
  const project = await projectServices.getProjectById(p(req, "id"));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project retrieved successfully",
    data: project,
  });
});

const update = catchAsync(async (req: AuthRequest, res: Response) => {
  const project = await projectServices.updateProject(
    p(req, "id"),
    req.body as UpdateProjectInput,
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project updated successfully",
    data: project,
  });
});

const remove = catchAsync(async (req: AuthRequest, res: Response) => {
  await projectServices.deleteProject(p(req, "id"));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project deleted successfully",
  });
});

const addMember = catchAsync(async (req: AuthRequest, res: Response) => {
  const project = await projectServices.addProjectMember(
    p(req, "id"),
    p(req, "memberId"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Member added to project",
    data: project,
  });
});

const removeMember = catchAsync(async (req: AuthRequest, res: Response) => {
  const project = await projectServices.removeProjectMember(
    p(req, "id"),
    p(req, "memberId"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Member removed from project",
    data: project,
  });
});

export const projectControllers = {
  create,
  getAll,
  getOne,
  update,
  remove,
  addMember,
  removeMember,
};
