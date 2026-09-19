import { Context, MiddlewareFn } from "telegraf";
import { loginViaBot } from "../api/backendClient";

interface CachedToken {
  token: string;
  expiresAt: number;
}

// Xotirada oddiy cache — har xabarda backendga so'rov yubormaslik uchun.
// Access token 15 daqiqa amal qiladi, biz 10 daqiqada yangilaymiz (ehtiyot chorasi).
const tokenCache = new Map<number, CachedToken>();
const TOKEN_TTL_MS = 10 * 60 * 1000;

export const identifyUser: MiddlewareFn<Context> = async (ctx, next) => {
  if (!ctx.from) return next();

  const cached = tokenCache.get(ctx.from.id);
  if (cached && cached.expiresAt > Date.now()) {
    (ctx.state as Record<string, unknown>).accessToken = cached.token;
    return next();
  }

  try {
    const { accessToken } = await loginViaBot({
      id: ctx.from.id,
      username: ctx.from.username,
      first_name: ctx.from.first_name,
    });
    tokenCache.set(ctx.from.id, { token: accessToken, expiresAt: Date.now() + TOKEN_TTL_MS });
    (ctx.state as Record<string, unknown>).accessToken = accessToken;
  } catch (err) {
    console.error("Backend auth xatosi:", (err as Error).message);
    await ctx.reply("Kechirasiz, hozircha xizmatga ulanib bo'lmadi. Birozdan keyin urinib ko'ring.");
    return;
  }

  return next();
};