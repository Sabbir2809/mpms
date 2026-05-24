import { Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { p } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { attachmentServices } from "./attachment.services";

const upload = catchAsync(async (req: AuthRequest, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "No files uploaded",
    });
  }
  const attachments = await attachmentServices.uploadAttachments(
    p(req, "projectId"),
    p(req, "taskId"),
    files,
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: `${attachments.length} file(s) uploaded successfully`,
    data: attachments,
  });
});

const getAll = catchAsync(async (req: AuthRequest, res: Response) => {
  const attachments = await attachmentServices.getAttachmentsByTask(
    p(req, "projectId"),
    p(req, "taskId"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Attachments retrieved successfully",
    data: attachments,
  });
});

const remove = catchAsync(async (req: AuthRequest, res: Response) => {
  await attachmentServices.deleteAttachment(
    p(req, "projectId"),
    p(req, "taskId"),
    p(req, "attachmentId"),
    req.user!.userId,
    req.user!.role,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Attachment deleted successfully",
  });
});

export const attachmentControllers = {
  upload,
  getAll,
  remove,
};
