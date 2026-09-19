import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // .env dagi ADMIN_IDS (vergul bilan ajratilgan Telegram ID'lar) SUPER_ADMIN qilinadi
  const adminIds = (process.env.ADMIN_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  for (const idStr of adminIds) {
    const telegramId = BigInt(idStr);
    await prisma.user.upsert({
      where: { telegramId },
      update: { role: "SUPER_ADMIN" },
      create: { telegramId, role: "SUPER_ADMIN" },
    });
    console.log(`✅ SUPER_ADMIN tayinlandi: ${idStr}`);
  }

  // Namuna test (quiz) — front-end/bot ishlashini tekshirish uchun
  const existingQuiz = await prisma.quiz.findFirst({ where: { title: "Boshlang'ich imlo testi" } });

  if (!existingQuiz) {
    await prisma.quiz.create({
      data: {
        title: "Boshlang'ich imlo testi",
        description: "O'zbek tili imlosi bo'yicha oddiy test",
        questions: {
          create: [
            {
              question: "To'g'ri yozilishini tanlang:",
              options: ["kelajak", "kelajaq", "kelajok"],
              correctIndex: 0,
              order: 1,
            },
            {
              question: "To'g'ri yozilishini tanlang:",
              options: ["mashg'ulot", "mashgulot", "mashg'ullot"],
              correctIndex: 0,
              order: 2,
            },
          ],
        },
      },
    });
    console.log("✅ Namuna test yaratildi");
  }
}

main()
  .catch((err) => {
    console.error("❌ Seed xatosi:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });