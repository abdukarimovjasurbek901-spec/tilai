import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { logSecurityEvent } from "../modules/security/securityEvent.service";

// Bot backendga ulanganda oddiy foydalanuvchi emas, ichki (trusted) xizmat
// ekanini shu maxfiy kalit orqali isbotlaydi. timingSafeEqual timing attack'ni oldini oladi.
export async function requireInternalSecret(req: Request, res: Response, next: NextFunction) {
  const provided = req.headers["x-internal-secret"];

  if (typeof provided !== "string") {
    return res.status(401).json({ error: "Ruxsat yo'q" });
  }

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(env.BOT_INTERNAL_SECRET);

  const isValid =
    providedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(providedBuffer, expectedBuffer);

  if (!isValid) {
    await logSecurityEvent({ eventType: "INVALID_INTERNAL_SECRET", ip: req.ip, endpoint: req.path });
    return res.status(401).json({ error: "Ruxsat yo'q" });
  }

  next();
}