import { Router } from "express";
import { authGuard, requireManagerOrAdmin } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";

import { taskControllers } from "./task.controllers";
import { taskValidations } from "./task.validations";

const taskRoutes = Router({ mergeParams: true });
taskRoutes.use(authGuard);

taskRoutes.get(
  "/",
  validateRequest(taskValidations.taskQuerySchema, "query"),
  taskControllers.getAll,
);
taskRoutes.get("/kanban", taskControllers.getKanban);
taskRoutes.post(
  "/",
  validateRequest(taskValidations.createTaskSchema),
  taskControllers.create,
);
taskRoutes.get("/:id", taskControllers.getOne);
taskRoutes.patch(
  "/:id",
  validateRequest(taskValidations.updateTaskSchema),
  taskControllers.update,
);
taskRoutes.delete("/:id", requireManagerOrAdmin, taskControllers.remove);
taskRoutes.post(
  "/:id/subtasks",
  validateRequest(taskValidations.addSubtaskSchema),
  taskControllers.createSubtask,
);
taskRoutes.patch(
  "/:id/subtasks/:subtaskId",
  validateRequest(taskValidations.updateSubtaskSchema),
  taskControllers.patchSubtask,
);
taskRoutes.delete("/:id/subtasks/:subtaskId", taskControllers.removeSubtask);
taskRoutes.post(
  "/:id/log-hours",
  validateRequest(taskValidations.logHoursSchema),
  taskControllers.log,
);
taskRoutes.post("/:id/approve", requireManagerOrAdmin, taskControllers.approve);
taskRoutes.post("/:id/reject", requireManagerOrAdmin, taskControllers.reject);

export default taskRoutes;
