import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";
import { config } from "./config";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "./middlewares";
import { taskRoutes, healthRoutes } from "./routes";

const prisma = new PrismaClient();

const app = express();

app.use(cors());

app.use(express.json());

// Health check endpoint
app.use("/health", healthRoutes);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Register routes
app.use(`/api/v1/tasks`, taskRoutes);

// Register error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port}`);

  // Connect to database
  await prisma.$connect();
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
