import mongoose, { Schema } from "mongoose";
import { ISprint, SprintStatus } from "./sprint.interface";

const sprintSchema = new Schema<ISprint>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Sprint name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },
    sprintNumber: {
      type: Number,
      required: true,
    },
    goal: {
      type: String,
      default: "",
      maxlength: [1000, "Goal cannot exceed 1000 characters"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      enum: Object.values(SprintStatus),
      default: SprintStatus.PLANNING,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// virtuals
sprintSchema.virtual("taskCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "sprint",
  count: true,
});

// indexes
sprintSchema.index({ project: 1, sprintNumber: 1 }, { unique: true });
sprintSchema.index({ project: 1, order: 1 });

export const Sprint = mongoose.model<ISprint>("Sprint", sprintSchema);
