import cron from "node-cron";
import { prisma } from "../server";
import { env } from "../config/env";

// Har kuni tunda ishlaydi, LOG_RETENTION_DAYS dan eski request_logs va
// security_events yozuvlarini o'chiradi. Bu "hammasini abadiy saqlash"
// o'rniga konfiguratsiya asosidagi retention siyosati.
export function startLogRetentionJob() {
  cron.schedule("0 3 * * *", async () => {
    const cutoff = new Date(Date.now() - env.LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const deletedRequestLogs = await prisma.requestLog.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });

    const deletedSecurityEvents = await prisma.securityEvent.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });

    console.log(
      `🧹 Log retention: ${deletedRequestLogs.count} request_logs, ${deletedSecurityEvents.count} security_events o'chirildi (${env.LOG_RETENTION_DAYS} kundan eski)`,
    );
  });

  console.log(`⏰ Log retention job ishga tushdi (har kuni 03:00, retention=${env.LOG_RETENTION_DAYS} kun)`);
}