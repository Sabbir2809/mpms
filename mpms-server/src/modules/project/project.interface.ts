import mongoose from "mongoose";
import { ProjectStatus } from "../../types";

export interface IProject extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  client: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: ProjectStatus;
  thumbnail?: string;
  createdBy: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
