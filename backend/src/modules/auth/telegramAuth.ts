import crypto from "crypto";
import { env } from "../../config/env";

// Telegram rasmiy dokumentatsiyasidagi algoritm:
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
export interface TelegramInitDataUser {
  id: number;
  username?: string;
  first_name?: string;
}

interface VerifiedInitData {
  user: TelegramInitDataUser;
  authDate: number;
}

const MAX_INIT_DATA_AGE_SECONDS = 24 * 60 * 60; // 24 soat

export function verifyTelegramInitData(initData: string): VerifiedInitData | null {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;

  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(env.BOT_TOKEN).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  // timingSafeEqual — hash solishtirishda timing attack'ning oldini oladi
  const hashBuffer = Buffer.from(hash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");
  if (hashBuffer.length !== computedBuffer.length || !crypto.timingSafeEqual(hashBuffer, computedBuffer)) {
    return null; // soxta yoki buzilgan initData
  }

  const authDate = Number(params.get("auth_date"));
  const now = Math.floor(Date.now() / 1000);
  if (!authDate || now - authDate > MAX_INIT_DATA_AGE_SECONDS) {
    return null; // muddati o'tgan
  }

  const userRaw = params.get("user");
  if (!userRaw) return null;

  const user: TelegramInitDataUser = JSON.parse(userRaw);
  return { user, authDate };
}