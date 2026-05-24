import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { authRateLimiter } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";

const authRoutes = Router();

authRoutes.post(
  "/register",
  authRateLimiter,
  validateRequest(authValidation.registerSchema),
  authController.register,
);

authRoutes.post(
  "/login",
  authRateLimiter,
  validateRequest(authValidation.loginSchema),
  authController.login,
);

authRoutes.post(
  "/refresh",
  validateRequest(authValidation.refreshTokenSchema),
  authController.refresh,
);

authRoutes.post("/logout", authGuard, authController.logout);

authRoutes.get("/me", authGuard, authController.getProfile);

export default authRoutes;
