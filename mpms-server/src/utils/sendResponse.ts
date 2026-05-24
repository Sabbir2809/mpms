import { Response } from "express";

interface SendResponseOptions<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const sendResponse = <T>(
  res: Response,
  options: SendResponseOptions<T>,
): void => {
  const { statusCode, success, message, data, meta } = options;

  res.status(statusCode).json({
    success,
    message,
    ...(meta && { meta }),
    ...(data !== undefined && { data }),
  });
};
