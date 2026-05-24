import { Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { p } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";

import { userServices } from "./user.services";
import {
  UpdatePasswordInput,
  UpdateUserInput,
  UpdateUserRoleInput,
  UserQueryInput,
} from "./user.validations";

const getUsers = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await userServices.getAllUsers(
    req.query as unknown as UserQueryInput,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result.users,
    meta: result.pagination,
  });
});

const getUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userServices.getUserById(p(req, "id"));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userServices.updateUser(
    p(req, "id"),
    req.body as UpdateUserInput,
    req.user!.userId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

const changeUserRole = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userServices.updateUserRole(
    p(req, "id"),
    req.body as UpdateUserRoleInput,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role updated successfully",
    data: user,
  });
});

const changePassword = catchAsync(async (req: AuthRequest, res: Response) => {
  await userServices.updatePassword(
    req.user!.userId,
    req.body as UpdatePasswordInput,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully",
  });
});

const deactivate = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userServices.deactivateUser(p(req, "id"));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deactivated successfully",
    data: user,
  });
});

const activate = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userServices.activateUser(p(req, "id"));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User activated successfully",
    data: user,
  });
});

const removeUser = catchAsync(async (req: AuthRequest, res: Response) => {
  await userServices.deleteUser(p(req, "id"));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
  });
});

export const userControllers = {
  getUsers,
  getUser,
  updateProfile,
  changeUserRole,
  changePassword,
  deactivate,
  activate,
  removeUser,
};
