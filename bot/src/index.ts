import { Telegraf } from "telegraf";
import { env } from "./config/env";
import { identifyUser } from "./middlewares/identify";
import { handleStart } from "./handlers/start.handler";
import { handleAbout } from "./handlers/about.handler";
import { handlePlaceholder } from "./handlers/placeholder.handler";

const bot = new Telegraf(env.BOT_TOKEN);

bot.use(identifyUser);

bot.start(handleStart);
bot.hears("ℹ️ Loyiha haqida", handleAbout);

bot.hears("✍️ Matnni tekshirish", handlePlaceholder);
bot.hears("📝 Matnni tahrirlash", handlePlaceholder);
bot.hears("📚 Grammatika", handlePlaceholder);
bot.hears("🔤 So'z izohi", handlePlaceholder);
bot.hears("🔄 Tarjima", handlePlaceholder);
bot.hears("🎓 Test", handlePlaceholder);
bot.hears("🤖 AI yordamchi", handlePlaceholder);
bot.hears("🎤 Ovoz → Matn", handlePlaceholder);
bot.hears("🔊 Matn → Ovoz", handlePlaceholder);

// Kutilmagan xatolar botni to'xtatib qo'ymasligi uchun
bot.catch((err, ctx) => {
  console.error(`Bot xatosi (update ${ctx.updateType}):`, err);
});

bot.launch().then(() => {
  console.log("✅ TilAI bot ishga tushdi (long polling)");
});

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));