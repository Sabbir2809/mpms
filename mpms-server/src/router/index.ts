import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import projectRoutes from "../modules/project/project.routes";
import sprintRoutes from "../modules/sprint/sprint.routes";
import userRoutes from "../modules/user/user.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/sprints", sprintRoutes);

export default apiRouter;
