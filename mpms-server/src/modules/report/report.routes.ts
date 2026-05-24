import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { reportControllers } from "./report.controllers";

const reportRoutes = Router({ mergeParams: true });
reportRoutes.use(authGuard);

reportRoutes.get("/project-progress", reportControllers.projectProgress);
reportRoutes.get("/user-progress", reportControllers.userProgress);
reportRoutes.get("/task-summary", reportControllers.taskSummary);
reportRoutes.get("/time-log", reportControllers.timeLog);

export default reportRoutes;
