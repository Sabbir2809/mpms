import { createServer } from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDB();

  const httpServer = createServer(app);

  httpServer.listen(env.port, () => {
    console.log(`\n🚀 MPMS Server running`);
    console.log(`   Environment : ${env.nodeEnv}`);
    console.log(`   Port        : ${env.port}`);
    console.log(`   API base    : http://localhost:${env.port}/api/v1`);
    console.log(`   Health      : http://localhost:${env.port}/health`);
  });

  const shutdown = (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully...`);
    httpServer.close(() => {
      console.log("✅ HTTP server closed");
      process.exit(0);
    });
    setTimeout(() => {
      console.error("⚠️  Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason: unknown) => {
    console.error("💥 Unhandled Rejection:", reason);
    process.exit(1);
  });

  process.on("uncaughtException", (error: Error) => {
    console.error("💥 Uncaught Exception:", error);
    process.exit(1);
  });
};

startServer();
