import { Router } from "express";
import { authGuard, requireManagerOrAdmin } from "../../middlewares/authGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { teamControllers } from "./team.controllers";
import { teamValidations } from "./team.validations";

const teamRoutes = Router({ mergeParams: true });
teamRoutes.use(authGuard);

teamRoutes.get("/", teamControllers.getTeam);
teamRoutes.post(
  "/",
  requireManagerOrAdmin,
  validateRequest(teamValidations.addTeamMemberSchema),
  teamControllers.addMember,
);
teamRoutes.patch(
  "/:memberId",
  requireManagerOrAdmin,
  validateRequest(teamValidations.updateTeamMemberSchema),
  teamControllers.updateMember,
);
teamRoutes.delete(
  "/:memberId",
  requireManagerOrAdmin,
  teamControllers.removeMember,
);

export default teamRoutes;
