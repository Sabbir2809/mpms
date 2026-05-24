import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  parentComment?: mongoose.Types.ObjectId;
  mentions: mongoose.Types.ObjectId[];
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
