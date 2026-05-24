import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { uploadRateLimiter } from "../../middlewares/rateLimiter";
import { upload as multerUpload } from "../../utils/upload";
import { attachmentControllers } from "./attachment.controllers";

const attachmentRoutes = Router({ mergeParams: true });
attachmentRoutes.use(authGuard);

attachmentRoutes.get("/", attachmentControllers.getAll);
attachmentRoutes.post(
  "/",
  uploadRateLimiter,
  multerUpload.array("files", 10),
  attachmentControllers.upload,
);
attachmentRoutes.delete("/:attachmentId", attachmentControllers.remove);

export default attachmentRoutes;
