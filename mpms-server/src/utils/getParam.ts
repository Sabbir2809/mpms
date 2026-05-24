import { Request } from "express";

/** Safely extract a route param as string (Express types return string | string[]) */
export const p = (req: Request, key: string): string => {
  const val = req.params[key];
  return Array.isArray(val) ? val[0] : (val ?? "");
};

/** Safely extract a query value as string */
export const q = (req: Request, key: string): string | undefined => {
  const val = req.query[key];
  if (val === undefined) return undefined;
  return Array.isArray(val) ? String(val[0]) : String(val);
};
