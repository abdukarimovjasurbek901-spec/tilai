import { Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import { env } from "../config/env";

export const redisClient = new Redis(env.REDIS_URL);

// Qatlamli rate-limit fabrikasi: har bir endpoint/guruh uchun alohida
// limiter yaratish mumkin (masalan AI uchun qattiqroq).
export function createRateLimiter(opts: { points: number; duration: number; keyPrefix: string }) {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: opts.points,       // ruxsat etilgan so'rovlar soni
    duration: opts.duration,   // shu vaqt oralig'ida (sekund)
    keyPrefix: opts.keyPrefix,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    // Login qilgan bo'lsa telegramId, bo'lmasa IP bo'yicha cheklaymiz
    const key = (req as any).user?.telegramId || req.ip;
    try {
      await limiter.consume(key);
      next();
    } catch {
      res.status(429).json({ error: "Juda ko'p so'rov yuborildi. Birozdan keyin urinib ko'ring." });
    }
  };
}

// Tayyor limiterlar
export const globalRateLimiter = createRateLimiter({ points: 100, duration: 60, keyPrefix: "rl_global" });
export const authRateLimiter = createRateLimiter({ points: 10, duration: 60, keyPrefix: "rl_auth" });
export const aiRateLimiter = createRateLimiter({
  points: env.AI_REQUEST_LIMIT_PER_MINUTE,
  duration: 60,
  keyPrefix: "rl_ai",
});