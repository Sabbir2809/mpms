import { Router } from "express";
import {
  authGuard,
  requireAdmin,
  requireManagerOrAdmin,
} from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { userControllers } from "./user.controllers";
import { userValidations } from "./user.validations";

const userRoutes = Router();

userRoutes.use(authGuard);

userRoutes.get(
  "/",
  requireManagerOrAdmin,
  validateRequest(userValidations.userQuerySchema, "query"),
  userControllers.getUsers,
);
userRoutes.get("/:id", userControllers.getUser);
userRoutes.patch(
  "/:id",
  validateRequest(userValidations.updateUserSchema),
  userControllers.updateProfile,
);
userRoutes.patch(
  "/:id/role",
  requireAdmin,
  validateRequest(userValidations.updateUserRoleSchema),
  userControllers.changeUserRole,
);
userRoutes.patch(
  "/me/password",
  validateRequest(userValidations.updatePasswordSchema),
  userControllers.changePassword,
);
userRoutes.patch("/:id/deactivate", requireAdmin, userControllers.deactivate);
userRoutes.patch("/:id/activate", requireAdmin, userControllers.activate);
userRoutes.delete("/:id", requireAdmin, userControllers.removeUser);

export default userRoutes;
