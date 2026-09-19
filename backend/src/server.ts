import { PrismaClient } from "@prisma/client";
import { app } from "./app";
import { env } from "./config/env";
import { startLogRetentionJob } from "./jobs/logRetention.job";

export const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  app.listen(env.PORT, () => {
    console.log(`✅ TilAI backend ${env.PORT}-portda ishga tushdi (${env.NODE_ENV})`);
  });
  startLogRetentionJob();
}

main().catch((err) => {
  console.error("❌ Server ishga tushmadi:", err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});