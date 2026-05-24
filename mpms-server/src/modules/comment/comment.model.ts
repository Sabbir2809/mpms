import mongoose, { Schema } from "mongoose";
import { IComment } from "./comment.interface";

const commentSchema = new Schema<IComment>(
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
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [5000, "Comment cannot exceed 5000 characters"],
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
});

commentSchema.index({ task: 1, createdAt: 1 });
commentSchema.index({ parentComment: 1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
