import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  // To'liq xato faqat server logida — foydalanuvchiga hech qachon stack trace ketmaydi
  console.error("[ERROR]", req.method, req.path, err);

  const status = err.statusCode || 500;
  const message = env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(status).json({ error: message });
}