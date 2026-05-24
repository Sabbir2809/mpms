import { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import { env } from "../config/env";
import { AppError } from "../utils/appError";

interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, unknown>[];
  stack?: string;
}

const handleCastError = (err: MongooseError.CastError): AppError =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKeyError = (err: MongoServerError): AppError => {
  const field = Object.keys(err.keyValue || {})[0] || "field";
  const value = err.keyValue?.[field];
  return new AppError(
    `Duplicate value for ${field}: "${value}". Please use another value.`,
    409,
  );
};

const handleValidationError = (
  err: MongooseError.ValidationError,
): AppError => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join(". ")}`, 422);
};

const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Token expired. Please log in again.", 401);

const sendErrorDev = (err: AppError, res: Response): void => {
  const response: ErrorResponse = {
    success: false,
    statusCode: err.statusCode,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  };
  res.status(err.statusCode).json(response);
};

const sendErrorProd = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    } as ErrorResponse);
  } else {
    console.error("💥 UNEXPECTED ERROR:", err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof MongooseError.CastError) {
    error = handleCastError(err);
  } else if ((err as MongoServerError).code === 11000) {
    error = handleDuplicateKeyError(err as MongoServerError);
  } else if (err instanceof MongooseError.ValidationError) {
    error = handleValidationError(err);
  } else if (err.name === "JsonWebTokenError") {
    error = handleJWTError();
  } else if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  } else {
    error = new AppError(err.message || "Internal server error", 500);
  }

  if (env.nodeEnv === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};
