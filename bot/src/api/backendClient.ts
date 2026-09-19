import axios from "axios";
import { env } from "../config/env";

const api = axios.create({ baseURL: env.BACKEND_URL, timeout: 10_000 });

export interface BotTelegramUser {
  id: number;
  username?: string;
  first_name?: string;
}

// BOT_INTERNAL_SECRET hech qachon logga yozilmaydi yoki foydalanuvchiga qaytarilmaydi.
export async function loginViaBot(user: BotTelegramUser) {
  const res = await api.post(
    "/api/v1/auth/bot",
    { telegramId: user.id, username: user.username, firstName: user.first_name },
    { headers: { "x-internal-secret": env.BOT_INTERNAL_SECRET } },
  );
  return res.data as { accessToken: string; refreshToken: string };
}

export async function getMyProfile(accessToken: string) {
  const res = await api.get("/api/v1/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}