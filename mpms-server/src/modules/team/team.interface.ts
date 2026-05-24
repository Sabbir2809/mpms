import mongoose from "mongoose";

export enum TeamRole {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

export interface ITeamMember extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  role: TeamRole;
  joinedAt: Date;
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
