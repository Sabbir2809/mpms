import { Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { p, q } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { taskServices } from "./task.services";
import {
  AddSubtaskInput,
  CreateTaskInput,
  LogHoursInput,
  TaskQueryInput,
  UpdateSubtaskInput,
  UpdateTaskInput,
} from "./task.validations";

const create = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.createTask(
    p(req, "projectId"),
    req.body as CreateTaskInput,
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await taskServices.getTasks(
    p(req, "projectId"),
    req.query as unknown as TaskQueryInput,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tasks retrieved successfully",
    data: result.tasks,
    meta: result.pagination,
  });
});

const getKanban = catchAsync(async (req: AuthRequest, res: Response) => {
  const board = await taskServices.getKanbanTasks(
    p(req, "projectId"),
    q(req, "sprint"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Kanban board retrieved",
    data: board,
  });
});

const getOne = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.getTaskById(
    p(req, "projectId"),
    p(req, "id"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task retrieved successfully",
    data: task,
  });
});

const update = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.updateTask(
    p(req, "projectId"),
    p(req, "id"),
    req.body as UpdateTaskInput,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});

const remove = catchAsync(async (req: AuthRequest, res: Response) => {
  await taskServices.deleteTask(p(req, "projectId"), p(req, "id"));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task deleted successfully",
  });
});

const createSubtask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.addSubtask(
    p(req, "projectId"),
    p(req, "id"),
    req.body as AddSubtaskInput,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Subtask added",
    data: task,
  });
});

const patchSubtask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.updateSubtask(
    p(req, "projectId"),
    p(req, "id"),
    p(req, "subtaskId"),
    req.body as UpdateSubtaskInput,
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subtask updated",
    data: task,
  });
});

const removeSubtask = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.deleteSubtask(
    p(req, "projectId"),
    p(req, "id"),
    p(req, "subtaskId"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subtask deleted",
    data: task,
  });
});

const log = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.logHours(
    p(req, "projectId"),
    p(req, "id"),
    req.body as LogHoursInput,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Hours logged successfully",
    data: task,
  });
});

const approve = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.approveTask(
    p(req, "projectId"),
    p(req, "id"),
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task approved",
    data: task,
  });
});

const reject = catchAsync(async (req: AuthRequest, res: Response) => {
  const task = await taskServices.rejectTask(
    p(req, "projectId"),
    p(req, "id"),
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task sent back to in-progress",
    data: task,
  });
});

export const taskControllers = {
  create,
  getAll,
  getKanban,
  getOne,
  update,
  remove,
  createSubtask,
  patchSubtask,
  removeSubtask,
  log,
  approve,
  reject,
};
