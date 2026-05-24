import mongoose, { Schema } from "mongoose";
import { ITeamMember, TeamRole } from "./team.interface";

const teamMemberSchema = new Schema<ITeamMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(TeamRole),
      default: TeamRole.MEMBER,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
teamMemberSchema.index({ user: 1, project: 1 }, { unique: true });

teamMemberSchema.index({ project: 1 });

export const TeamMember = mongoose.model<ITeamMember>(
  "TeamMember",
  teamMemberSchema,
);
