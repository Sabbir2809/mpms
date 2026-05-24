import { NextFunction, Response } from "express";
import { AuthRequest, UserRole } from "../types";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { verifyAccessToken } from "../utils/jwt";

export const authGuard = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required. Please log in.", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Authentication token missing", 401);
    }

    const decoded = verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role as UserRole,
    };

    next();
  },
);

export const requireRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Required roles: ${roles.join(", ")}`,
        403,
      );
    }

    next();
  };
};

export const requireAdmin = requireRoles(UserRole.ADMIN);
export const requireManagerOrAdmin = requireRoles(
  UserRole.ADMIN,
  UserRole.MANAGER,
);
