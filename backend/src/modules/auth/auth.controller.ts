import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../server";
import { verifyTelegramInitData } from "./telegramAuth";
import { signAccessToken, signRefreshToken, verifyToken } from "../../utils/jwt";
import { logSecurityEvent } from "../security/securityEvent.service";

const telegramLoginSchema = z.object({
  initData: z.string().min(1),
});

export async function telegramLogin(req: Request, res: Response) {
  const { initData } = telegramLoginSchema.parse(req.body);

  const verified = verifyTelegramInitData(initData);
  if (!verified) {
    await logSecurityEvent({ eventType: "INVALID_INIT_DATA", ip: req.ip, endpoint: req.path });
    return res.status(401).json({ error: "Telegram autentifikatsiyasi muvaffaqiyatsiz" });
  }

  const { user: tgUser } = verified;

  const user = await prisma.user.upsert({
    where: { telegramId: BigInt(tgUser.id) },
    update: { username: tgUser.username, firstName: tgUser.first_name, lastActivityAt: new Date() },
    create: { telegramId: BigInt(tgUser.id), username: tgUser.username, firstName: tgUser.first_name },
  });

  if (user.isBlocked) {
    return res.status(403).json({ error: "Hisobingiz bloklangan" });
  }

  const payload = { userId: user.id.toString(), telegramId: user.telegramId.toString(), role: user.role };

  res.json({ accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) });
}

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = refreshSchema.parse(req.body);
  try {
    const payload = verifyToken(refreshToken);
    res.json({ accessToken: signAccessToken(payload) });
  } catch {
    res.status(401).json({ error: "Refresh token yaroqsiz" });
  }
}

// Bot uchun: Telegram Bot API orqali kelgan (allaqachon Telegram tomonidan
// tasdiqlangan) foydalanuvchini ro'yxatdan o'tkazadi/yangilaydi.
// Bu endpoint faqat requireInternalSecret middleware bilan himoyalangan holda chaqiriladi.
const botLoginSchema = z.object({
  telegramId: z.number(),
  username: z.string().optional(),
  firstName: z.string().optional(),
});

export async function botLogin(req: Request, res: Response) {
  const { telegramId, username, firstName } = botLoginSchema.parse(req.body);

  const user = await prisma.user.upsert({
    where: { telegramId: BigInt(telegramId) },
    update: { username, firstName, lastActivityAt: new Date() },
    create: { telegramId: BigInt(telegramId), username, firstName },
  });

  if (user.isBlocked) {
    return res.status(403).json({ error: "Hisobingiz bloklangan" });
  }

  const payload = { userId: user.id.toString(), telegramId: user.telegramId.toString(), role: user.role };

  res.json({ accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) });
}