import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { authRateLimiter } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { authControllers } from "./auth.controllers";
import { authValidations } from "./auth.validations";

const authRoutes = Router();

authRoutes.post(
  "/register",
  authRateLimiter,
  validateRequest(authValidations.registerSchema),
  authControllers.register,
);

authRoutes.post(
  "/login",
  authRateLimiter,
  validateRequest(authValidations.loginSchema),
  authControllers.login,
);

authRoutes.post(
  "/refresh",
  validateRequest(authValidations.refreshTokenSchema),
  authControllers.refresh,
);

authRoutes.post("/logout", authGuard, authControllers.logout);

authRoutes.get("/me", authGuard, authControllers.getProfile);

export default authRoutes;
