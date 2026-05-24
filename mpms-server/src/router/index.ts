import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import projectRoutes from "../modules/project/project.routes";
import sprintRoutes from "../modules/sprint/sprint.routes";
import taskRoutes from "../modules/task/task.routes";
import userRoutes from "../modules/user/user.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/sprints", sprintRoutes);
apiRouter.use("/tasks", taskRoutes);

export default apiRouter;
