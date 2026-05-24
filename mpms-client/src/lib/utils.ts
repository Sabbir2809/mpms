import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDate = (date: string | Date, fmt = "MMM D, YYYY"): string =>
  dayjs(date).format(fmt);

export const formatDateTime = (date: string | Date): string =>
  dayjs(date).format("MMM D, YYYY HH:mm");

export const timeAgo = (date: string | Date): string => dayjs(date).fromNow();

export const formatCurrency = (amount: number, currency = "USD"): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const truncate = (str: string, max = 80): string =>
  str.length <= max ? str : `${str.slice(0, max)}…`;

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const buildQuery = (params: Record<string, unknown>): string => {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return qs ? `?${qs}` : "";
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

export const clsx = (
  ...classes: (string | undefined | null | false)[]
): string => classes.filter(Boolean).join(" ");

export const isOverdue = (dueDate?: string): boolean =>
  !!dueDate && new Date(dueDate) < new Date();

export const percentOf = (part: number, total: number): number =>
  total === 0 ? 0 : Math.round((part / total) * 100);

export const avatarColor = (name: string): string => {
  const colors = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#00a2ae",
    "#f44336",
    "#9c27b0",
    "#2196f3",
    "#4caf50",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};
