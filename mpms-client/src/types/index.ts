// Enums
export type UserRole = "admin" | "manager" | "member";
export type ProjectStatus = "planned" | "active" | "completed" | "archived";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type SprintStatus = "planning" | "active" | "completed" | "cancelled";

// Auth types
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  skills: string[];
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  department?: string;
  skills?: string[];
}

// Project types
export interface Project {
  _id: string;
  title: string;
  client: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: ProjectStatus;
  thumbnail?: string;
  createdBy: AuthUser;
  members: AuthUser[];
  sprintCount?: number;
  taskCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  title: string;
  client: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget: number;
  status?: ProjectStatus;
  members?: string[];
}

export type UpdateProjectInput = Partial<CreateProjectInput>;

// Sprint types
export interface Sprint {
  _id: string;
  project: string;
  name: string;
  sprintNumber: number;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  order: number;
  createdBy: AuthUser;
  taskCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSprintInput {
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status?: SprintStatus;
  order?: number;
}

export type UpdateSprintInput = Partial<CreateSprintInput>;

// Task types
export interface Subtask {
  _id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: AuthUser;
}

export interface Task {
  _id: string;
  project: string;
  sprint?: Sprint;
  title: string;
  description: string;
  assignees: AuthUser[];
  estimateHours: number;
  loggedHours: number;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  attachments: Attachment[];
  subtasks: Subtask[];
  tags: string[];
  createdBy: AuthUser;
  reviewedBy?: AuthUser;
  reviewedAt?: string;
  completedAt?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  sprint?: string;
  assignees?: string[];
  estimateHours?: number;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  loggedHours?: number;
  order?: number;
}

export type KanbanBoard = Record<TaskStatus, Task[]>;

// Team types
export interface TeamMember {
  _id: string;
  user: AuthUser;
  project: string;
  role: UserRole;
  joinedAt: string;
  addedBy: AuthUser;
}

// Comment types
export interface Comment {
  _id: string;
  task: string;
  project: string;
  author: AuthUser;
  content: string;
  parentComment?: string;
  mentions: AuthUser[];
  replies?: Comment[];
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Attachment types
export interface Attachment {
  _id: string;
  task: string;
  project: string;
  uploadedBy: AuthUser;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  type: "image" | "pdf" | "other";
  createdAt: string;
}

//  API Response wrappers types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: { field: string; message: string }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// Query params types
export interface ProjectQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  client?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface TaskQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sprint?: string;
  assignee?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  department?: string;
  isActive?: boolean;
}

// Reports types
export interface ProjectProgressReport {
  project: {
    id: string;
    title: string;
    client: string;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
    budget: number;
    memberCount: number;
  };
  taskSummary: {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    completed: number;
    completionPercentage: number;
  };
  timeTracking: {
    totalEstimateHours: number;
    totalLoggedHours: number;
    remainingHours: number;
  };
  timeline: {
    totalDays: number;
    elapsedDays: number;
    timeProgress: number;
  };
  priorityBreakdown: Record<TaskPriority, number>;
  sprintProgress: Array<{
    sprintId: string;
    sprintName: string;
    sprintNumber: number;
    status: SprintStatus;
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
  }>;
  generatedAt: string;
}

export interface UserProgressReport {
  projectId: string;
  projectTitle: string;
  userStats: Array<{
    userId: string;
    name: string;
    email: string;
    avatar?: string;
    department: string;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    reviewTasks: number;
    todoTasks: number;
    totalLoggedHours: number;
    totalEstimateHours: number;
    completionRate: number;
    overdueTasks: number;
  }>;
  generatedAt: string;
}

export interface TaskSummaryReport {
  projectId: string;
  projectTitle: string;
  sprintId: string | null;
  summary: {
    total: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
    overdue: number;
    completedWithinEstimate: number;
  };
  overdueTasks: Partial<Task>[];
  tasks: Partial<Task>[];
  generatedAt: string;
}

export interface TimeLogReport {
  projectId: string;
  projectTitle: string;
  dateRange: { startDate: string | null; endDate: string | null };
  overall: {
    totalEstimateHours: number;
    totalLoggedHours: number;
    variance: number;
    efficiency: number;
  };
  byMember: Array<{
    userId: string;
    name: string;
    email: string;
    loggedHours: number;
    taskCount: number;
  }>;
  bySprint: Array<{
    sprintId: string;
    sprintName: string;
    sprintNumber: number;
    estimateHours: number;
    loggedHours: number;
    taskCount: number;
  }>;
  generatedAt: string;
}
