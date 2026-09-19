import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const envSchema = z.object({
  BOT_TOKEN: z.string().min(1),
  BACKEND_URL: z.string().min(1).default("http://localhost:3000"),
  BOT_INTERNAL_SECRET: z.string().min(16),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Bot uchun environment o'zgaruvchilar noto'g'ri:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;