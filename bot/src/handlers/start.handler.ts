import { Context } from "telegraf";
import { mainMenuKeyboard } from "../keyboards/mainMenu";

export async function handleStart(ctx: Context) {
  await ctx.reply(
    "Assalomu alaykum! 🇺🇿 TilAI — o'zbek tili raqamli yordamchisiga xush kelibsiz.\n\n" +
      "Quyidagi menyudan kerakli funksiyani tanlang:",
    mainMenuKeyboard,
  );
}