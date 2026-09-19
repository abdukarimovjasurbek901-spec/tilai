import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  BOT_TOKEN: z.string().min(1),
  BOT_INTERNAL_SECRET: z.string().min(16, "BOT_INTERNAL_SECRET kamida 16 belgi bo'lishi kerak"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET kamida 16 belgi bo'lishi kerak"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  AI_REQUEST_LIMIT_PER_MINUTE: z.coerce.number().default(10),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  LOG_RETENTION_DAYS: z.coerce.number().default(30),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Environment o'zgaruvchilar noto'g'ri:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;