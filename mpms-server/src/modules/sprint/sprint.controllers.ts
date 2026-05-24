import { Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { p } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { sprintServices } from "./sprint.services";
import {
  CreateSprintInput,
  ReorderSprintsInput,
  UpdateSprintInput,
} from "./sprint.validations";

const create = catchAsync(async (req: AuthRequest, res: Response) => {
  const sprint = await sprintServices.createSprint(
    p(req, "projectId"),
    req.body as CreateSprintInput,
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Sprint created successfully",
    data: sprint,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res: Response) => {
  const sprints = await sprintServices.getSprintsByProject(p(req, "projectId"));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprints retrieved successfully",
    data: sprints,
  });
});

const getOne = catchAsync(async (req: AuthRequest, res: Response) => {
  const sprint = await sprintServices.getSprintById(
    p(req, "projectId"),
    p(req, "id"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint retrieved successfully",
    data: sprint,
  });
});

const update = catchAsync(async (req: AuthRequest, res: Response) => {
  const sprint = await sprintServices.updateSprint(
    p(req, "projectId"),
    p(req, "id"),
    req.body as UpdateSprintInput,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint updated successfully",
    data: sprint,
  });
});

const remove = catchAsync(async (req: AuthRequest, res: Response) => {
  await sprintServices.deleteSprint(p(req, "projectId"), p(req, "id"));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint deleted successfully",
  });
});

const reorder = catchAsync(async (req: AuthRequest, res: Response) => {
  const sprints = await sprintServices.reorderSprints(
    p(req, "projectId"),
    req.body as ReorderSprintsInput,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprints reordered successfully",
    data: sprints,
  });
});

export const sprintControllers = {
  create,
  getAll,
  getOne,
  update,
  remove,
  reorder,
};
