import { Router } from "express";
import attachmentRoutes from "../modules/attachment/attachment.routes";
import authRoutes from "../modules/auth/auth.routes";
import commentRoutes from "../modules/comment/comment.routes";
import projectRoutes from "../modules/project/project.routes";
import reportRoutes from "../modules/report/report.routes";
import sprintRoutes from "../modules/sprint/sprint.routes";
import taskRoutes from "../modules/task/task.routes";
import teamRoutes from "../modules/team/team.routes";
import userRoutes from "../modules/user/user.routes";

const apiRouter = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/projects",
    route: projectRoutes,
  },
  {
    path: "/projects/:projectId/sprints",
    route: sprintRoutes,
  },
  {
    path: "/projects/:projectId/tasks",
    route: taskRoutes,
  },
  {
    path: "/projects/:projectId/team",
    route: teamRoutes,
  },
  {
    path: "/projects/:projectId/reports",
    route: reportRoutes,
  },
  {
    path: "/projects/:projectId/tasks/:taskId/comments",
    route: commentRoutes,
  },
  {
    path: "/projects/:projectId/tasks/:taskId/attachments",
    route: attachmentRoutes,
  },
];

moduleRoutes.forEach((route) => {
  apiRouter.use(route.path, route.route);
});

export default apiRouter;
