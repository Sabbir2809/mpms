import { Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { p } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { commentServices } from "./comment.services";
import { CreateCommentInput, UpdateCommentInput } from "./comment.validations";

const getComments = catchAsync(async (req: AuthRequest, res: Response) => {
  const comments = await commentServices.getCommentsByTask(
    p(req, "projectId"),
    p(req, "taskId"),
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comments retrieved successfully",
    data: comments,
  });
});

const create = catchAsync(async (req: AuthRequest, res: Response) => {
  const comment = await commentServices.createComment(
    p(req, "projectId"),
    p(req, "taskId"),
    req.body as CreateCommentInput,
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Comment created successfully",
    data: comment,
  });
});

const update = catchAsync(async (req: AuthRequest, res: Response) => {
  const comment = await commentServices.updateComment(
    p(req, "commentId"),
    req.body as UpdateCommentInput,
    req.user!.userId,
    req.user!.role,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment updated successfully",
    data: comment,
  });
});

const remove = catchAsync(async (req: AuthRequest, res: Response) => {
  await commentServices.deleteComment(
    p(req, "commentId"),
    req.user!.userId,
    req.user!.role,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Comment deleted successfully",
  });
});

export const commentControllers = {
  getComments,
  create,
  update,
  remove,
};
