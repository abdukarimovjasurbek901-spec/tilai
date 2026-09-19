import { Context } from "telegraf";

export async function handleAbout(ctx: Context) {
  await ctx.reply(
    "🇺🇿 TilAI — O'zbek tilini raqamlashtirish loyihasi.\n\n" +
      "Imlo va grammatika tekshirish, tarjima, testlar va AI yordamchi orqali " +
      "o'zbek tilidan raqamli muhitda to'g'ri foydalanishga yordam beradi.",
  );
}