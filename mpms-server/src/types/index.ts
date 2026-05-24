import { Request } from "express";
import { Types } from "mongoose";

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

// We extend Request without overriding params to stay compatible with Express types
export interface AuthRequest extends Request {
  user?: AuthUser;
}

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

export enum ProjectStatus {
  PLANNED = "planned",
  ACTIVE = "active",
  COMPLETED = "completed",
  ARCHIVED = "archived",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface QueryFilters {
  [key: string]: unknown;
}

export type ObjectId = Types.ObjectId;
