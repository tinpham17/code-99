import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().min(1, "PORT is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const env = envSchema.parse(process.env);

export const config = {
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
};

console.log(`Port: ${config.port}`);
console.log(`Database: ${config.databaseUrl}`);
