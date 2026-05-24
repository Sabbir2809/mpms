import { Router } from "express";
import attachmentRoutes from "../modules/attachment/attachment.routes";
import authRoutes from "../modules/auth/auth.routes";
import commentRoutes from "../modules/comment/comment.routes";
import projectRoutes from "../modules/project/project.routes";
import sprintRoutes from "../modules/sprint/sprint.routes";
import taskRoutes from "../modules/task/task.routes";
import teamRoutes from "../modules/team/team.routes";
import userRoutes from "../modules/user/user.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/sprints", sprintRoutes);
apiRouter.use("/tasks", taskRoutes);
apiRouter.use("/teams", teamRoutes);
apiRouter.use("/comments", commentRoutes);
apiRouter.use("/attachments", attachmentRoutes);

export default apiRouter;
