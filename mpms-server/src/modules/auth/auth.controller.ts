import { Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";
import {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from "./auth.validation";

const register = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await authService.registerUser(req.body as RegisterInput);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

const login = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await authService.loginUser(req.body as LoginInput);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

const refresh = catchAsync(async (req: AuthRequest, res: Response) => {
  const tokens = await authService.refreshAccessToken(
    req.body as RefreshTokenInput,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tokens refreshed successfully",
    data: tokens,
  });
});

const logout = catchAsync(async (req: AuthRequest, res: Response) => {
  await authService.logoutUser(req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged out successfully",
  });
});

const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully",
    data: user,
  });
});

export const authController = {
  register,
  login,
  refresh,
  logout,
  getProfile,
};
