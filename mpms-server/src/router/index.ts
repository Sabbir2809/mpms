import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);

export default apiRouter;
