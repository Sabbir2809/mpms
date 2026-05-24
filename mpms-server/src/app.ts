import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import path from "path";
import { corsMiddleware } from "./config/cors";
import { env } from "./config/env";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { globalRateLimiter } from "./middlewares/rateLimiter";
import apiRouter from "./router";

const app: Application = express();

/* ── Security ── */
app.use(corsMiddleware);

/* ── Rate limiting ── */
app.use(globalRateLimiter);

/* ── Request parsing ── */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ── Logging ── */
if (env.nodeEnv !== "test") {
  app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
}

/* ── Static file serving for uploads ── */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), env.uploadDir), {
    maxAge: "1d",
    etag: true,
  }),
);

/* ── Health check ── */
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    environment: env.nodeEnv,
    message: "MPMS API is up and running!",
  });
});

/* ── API routes ── */
app.use("/api/v1", apiRouter);

/* ── 404 handler ── */
app.use(notFound);

/* ── Global error handler ── */
app.use(globalErrorHandler);

export default app;
