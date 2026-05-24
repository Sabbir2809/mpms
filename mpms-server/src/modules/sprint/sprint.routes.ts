import { Router } from "express";
import { authGuard, requireManagerOrAdmin } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { sprintControllers } from "./sprint.controllers";
import { sprintValidations } from "./sprint.validations";

const sprintRoutes = Router({ mergeParams: true });
sprintRoutes.use(authGuard);

sprintRoutes.get("/", sprintControllers.getAll);
sprintRoutes.post(
  "/",
  requireManagerOrAdmin,
  validateRequest(sprintValidations.createSprintSchema),
  sprintControllers.create,
);
sprintRoutes.get("/:id", sprintControllers.getOne);
sprintRoutes.patch(
  "/:id",
  requireManagerOrAdmin,
  validateRequest(sprintValidations.updateSprintSchema),
  sprintControllers.update,
);
sprintRoutes.delete("/:id", requireManagerOrAdmin, sprintControllers.remove);
sprintRoutes.patch(
  "/",
  requireManagerOrAdmin,
  validateRequest(sprintValidations.reorderSprintsSchema),
  sprintControllers.reorder,
);

export default sprintRoutes;
