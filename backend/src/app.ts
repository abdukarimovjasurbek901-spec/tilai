import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import { globalRateLimiter } from "./middlewares/rateLimit";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" })); // request size limit
app.use(globalRateLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);

// noma'lum route'lar uchun
app.use((_req, res) => res.status(404).json({ error: "Topilmadi" }));

// errorHandler har doim eng oxirida bo'lishi shart
app.use(errorHandler);