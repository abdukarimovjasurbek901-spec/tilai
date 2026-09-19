import crypto from "crypto";
import { prisma } from "../../server";
import { env } from "../../config/env";

// IP hech qachon xom holda saqlanmaydi — HMAC bilan hashlanadi.
export function hashIp(ip: string): string {
  return crypto.createHmac("sha256", env.JWT_SECRET).update(ip).digest("hex");
}

export async function logSecurityEvent(params: {
  eventType: string;
  userId?: bigint;
  ip?: string;
  endpoint?: string;
  details?: Record<string, unknown>;
}) {
  await prisma.securityEvent.create({
    data: {
      eventType: params.eventType,
      userId: params.userId,
      ipHash: params.ip ? hashIp(params.ip) : undefined,
      endpoint: params.endpoint,
      details: params.details,
    },
  });
}