import { Response } from "express";
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { p } from "../../utils/getParam";
import { sendResponse } from "../../utils/sendResponse";
import { teamServices } from "./team.services";
import { AddTeamMemberInput, UpdateTeamMemberInput } from "./team.validations";

const getTeam = catchAsync(async (req: AuthRequest, res: Response) => {
  const members = await teamServices.getTeamByProject(p(req, "projectId"));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Team retrieved",
    data: members,
  });
});

const addMember = catchAsync(async (req: AuthRequest, res: Response) => {
  const member = await teamServices.addTeamMember(
    p(req, "projectId"),
    req.body as AddTeamMemberInput,
    req.user!.userId,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Team member added",
    data: member,
  });
});

const updateMember = catchAsync(async (req: AuthRequest, res: Response) => {
  const member = await teamServices.updateTeamMember(
    p(req, "projectId"),
    p(req, "memberId"),
    req.body as UpdateTeamMemberInput,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Team member updated",
    data: member,
  });
});

const removeMember = catchAsync(async (req: AuthRequest, res: Response) => {
  await teamServices.removeTeamMember(p(req, "projectId"), p(req, "memberId"));
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Team member removed",
  });
});

export const teamControllers = {
  getTeam,
  addMember,
  updateMember,
  removeMember,
};
