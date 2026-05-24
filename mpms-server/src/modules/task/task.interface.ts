import mongoose from "mongoose";
import { TaskPriority, TaskStatus } from "../../types";

export interface ISubtask {
  _id: mongoose.Types.ObjectId;
  title: string;
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: mongoose.Types.ObjectId;
}

export interface ITask extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  sprint?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  assignees: mongoose.Types.ObjectId[];
  estimateHours: number;
  loggedHours: number;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  attachments: mongoose.Types.ObjectId[];
  subtasks: ISubtask[];
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  completedAt?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
