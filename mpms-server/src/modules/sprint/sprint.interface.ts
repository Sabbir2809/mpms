import mongoose from "mongoose";

export enum SprintStatus {
  PLANNING = "planning",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface ISprint extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  name: string;
  sprintNumber: number;
  goal: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
  order: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
