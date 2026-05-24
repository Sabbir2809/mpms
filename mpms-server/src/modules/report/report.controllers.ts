import { Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { p, q } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { reportServices } from "./report.services";

const projectProgress = catchAsync(async (req: AuthRequest, res: Response) => {
  const report = await reportServices.getProjectProgressReport(
    p(req, "projectId"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project progress report generated",
    data: report,
  });
});

const userProgress = catchAsync(async (req: AuthRequest, res: Response) => {
  const report = await reportServices.getUserProgressReport(
    p(req, "projectId"),
    q(req, "userId"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User progress report generated",
    data: report,
  });
});

const taskSummary = catchAsync(async (req: AuthRequest, res: Response) => {
  const report = await reportServices.getTaskSummaryReport(
    p(req, "projectId"),
    q(req, "sprint"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task summary report generated",
    data: report,
  });
});

const timeLog = catchAsync(async (req: AuthRequest, res: Response) => {
  const report = await reportServices.getTimeLogReport(
    p(req, "projectId"),
    q(req, "startDate"),
    q(req, "endDate"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time log report generated",
    data: report,
  });
});

export const reportControllers = {
  projectProgress,
  userProgress,
  taskSummary,
  timeLog,
};
