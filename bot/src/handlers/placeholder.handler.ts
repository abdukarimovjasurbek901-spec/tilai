import { Context } from "telegraf";

// AI funksiyalari (imlo, grammatika, tarjima, ovoz va h.k.) Phase 6'da
// AI service layer tayyor bo'lgach ulanadi. Hozircha xabar beramiz, xato bermaymiz.
export async function handlePlaceholder(ctx: Context) {
  await ctx.reply("⏳ Bu funksiya hozircha tayyorlanmoqda (keyingi fazada qo'shiladi). Tez orada ishga tushadi!");
}