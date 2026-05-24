import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { commentControllers } from "./comment.controllers";
import { commentValidations } from "./comment.validations";

const commentRoutes = Router({ mergeParams: true });
commentRoutes.use(authGuard);

commentRoutes.get("/", commentControllers.getComments);
commentRoutes.post(
  "/",
  validateRequest(commentValidations.createCommentSchema),
  commentControllers.create,
);
commentRoutes.patch(
  "/:commentId",
  validateRequest(commentValidations),
  commentControllers.update,
);
commentRoutes.delete("/:commentId", commentControllers.remove);

export default commentRoutes;
