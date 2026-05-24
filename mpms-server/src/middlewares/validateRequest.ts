import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/appError";

type RequestPart = "body" | "query" | "params";

export const validateRequest = (
  schema: z.ZodTypeAny,
  part: RequestPart = "body",
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const errors = result.error.errors.map(
        (err: { path: any[]; message: any; code: any }) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }),
      );

      return next(
        new AppError(errors[0]?.message ?? "Validation failed", 422, errors),
      );
    }

    req[part] = result.data;
    next();
  };
};
