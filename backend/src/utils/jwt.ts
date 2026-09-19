import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;   // BigInt -> string qilib saqlanadi (JWT JSON BigInt'ni yoqtirmaydi)
  telegramId: string;
  role: "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  // Agar token noto'g'ri/eskirgan bo'lsa, jwt.verify o'zi xato tashlaydi —
  // buni middleware catch qiladi.
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}