import type {
  ProjectStatus,
  SprintStatus,
  TaskPriority,
  TaskStatus,
  UserRole,
} from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const COOKIE_ACCESS_TOKEN = "mpms_access_token";
export const COOKIE_REFRESH_TOKEN = "mpms_refresh_token";
export const COOKIE_USER = "mpms_user";

/* ── Status labels & colours ── */
export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  planned: { label: "Planned", color: "blue" },
  active: { label: "Active", color: "green" },
  completed: { label: "Completed", color: "purple" },
  archived: { label: "Archived", color: "default" },
};

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string }
> = {
  todo: { label: "To Do", color: "default" },
  in_progress: { label: "In Progress", color: "processing" },
  review: { label: "Review", color: "warning" },
  done: { label: "Done", color: "success" },
};

export const TASK_PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string }
> = {
  low: { label: "Low", color: "blue" },
  medium: { label: "Medium", color: "orange" },
  high: { label: "High", color: "red" },
  urgent: { label: "Urgent", color: "magenta" },
};

export const SPRINT_STATUS_CONFIG: Record<
  SprintStatus,
  { label: string; color: string }
> = {
  planning: { label: "Planning", color: "blue" },
  active: { label: "Active", color: "green" },
  completed: { label: "Completed", color: "purple" },
  cancelled: { label: "Cancelled", color: "red" },
};

export const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  admin: { label: "Admin", color: "red" },
  manager: { label: "Manager", color: "blue" },
  member: { label: "Member", color: "green" },
};

/* ── Pagination ── */
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = ["10", "20", "50"];

/* ── Navigation ── */
export const NAV_ITEMS = [
  { key: "/dashboard", label: "Dashboard", icon: "HomeOutlined" },
  { key: "/dashboard/projects", label: "Projects", icon: "ProjectOutlined" },
  { key: "/dashboard/team", label: "Team", icon: "TeamOutlined" },
  { key: "/dashboard/reports", label: "Reports", icon: "BarChartOutlined" },
];

export const ADMIN_NAV_ITEMS = [
  { key: "/admin/projects", label: "Projects", icon: "ProjectOutlined" },
  { key: "/admin/users", label: "Users", icon: "UserOutlined" },
];

/* ── File upload ── */
export const ACCEPTED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  pdf: ["application/pdf"],
};
export const MAX_FILE_SIZE_MB = 10;
