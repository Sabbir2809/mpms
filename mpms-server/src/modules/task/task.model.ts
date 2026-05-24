import mongoose, { Schema } from "mongoose";
import { TaskPriority, TaskStatus } from "../../types";
import { ISubtask, ITask } from "./task.interface";

const subtaskSchema = new Schema<ISubtask>(
  {
    title: {
      type: String,
      required: [true, "Subtask title is required"],
      trim: true,
      maxlength: [500, "Subtask title cannot exceed 500 characters"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    completedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: true },
);

const taskSchema = new Schema<ITask>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    sprint: {
      type: Schema.Types.ObjectId,
      ref: "Sprint",
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [500, "Title cannot exceed 500 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [10000, "Description cannot exceed 10000 characters"],
    },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    estimateHours: {
      type: Number,
      default: 0,
      min: [0, "Estimate hours cannot be negative"],
    },
    loggedHours: {
      type: Number,
      default: 0,
      min: [0, "Logged hours cannot be negative"],
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    dueDate: Date,
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],
    subtasks: [subtaskSchema],
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
    completedAt: Date,
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// indexes
taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, sprint: 1 });
taskSchema.index({ assignees: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ project: 1, status: 1, order: 1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);
