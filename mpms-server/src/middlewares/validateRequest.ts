import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { AppError } from "../utils/appError";

type RequestPart = "body" | "query" | "params";

export const validateRequest = (
  schema: ZodSchema,
  part: RequestPart = "body",
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      const firstError = (errors[0]?.message as string) || "Validation failed";
      return next(new AppError(firstError, 422, errors));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)[part] = result.data;
    next();
  };
};

const formatZodErrors = (error: ZodError): Record<string, unknown>[] =>
  error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
  }));
