import mongoose, { Document } from "mongoose";

export type AttachmentType = "image" | "pdf" | "other";

export interface IAttachment extends Document {
  _id: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  type: AttachmentType;
  createdAt: Date;
  updatedAt: Date;
}
