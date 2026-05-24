import { Router } from "express";
import {
  authGuard,
  requireAdmin,
  requireManagerOrAdmin,
} from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";

import { projectControllers } from "./project.controllers";
import { projectValidations } from "./project.validations";

const projectRoutes = Router();
projectRoutes.use(authGuard);

projectRoutes.get(
  "/",
  validateRequest(projectValidations.projectQuerySchema, "query"),
  projectControllers.getAll,
);
projectRoutes.post(
  "/",
  requireManagerOrAdmin,
  validateRequest(projectValidations.createProjectSchema),
  projectControllers.create,
);
projectRoutes.get("/:id", projectControllers.getOne);
projectRoutes.patch(
  "/:id",
  requireManagerOrAdmin,
  validateRequest(projectValidations.updateProjectSchema),
  projectControllers.update,
);
projectRoutes.delete("/:id", requireAdmin, projectControllers.remove);
projectRoutes.post(
  "/:id/members/:memberId",
  requireManagerOrAdmin,
  projectControllers.addMember,
);
projectRoutes.delete(
  "/:id/members/:memberId",
  requireManagerOrAdmin,
  projectControllers.removeMember,
);

export default projectRoutes;
