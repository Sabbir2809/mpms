import mongoose, { Schema } from "mongoose";
import { IAttachment } from "./attachment.interface";

const attachmentSchema = new Schema<IAttachment>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "pdf", "other"],
      required: true,
    },
  },
  { timestamps: true },
);

attachmentSchema.index({ project: 1 });

export const Attachment = mongoose.model<IAttachment>(
  "Attachment",
  attachmentSchema,
);
