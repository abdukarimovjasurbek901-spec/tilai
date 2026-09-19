import { Markup } from "telegraf";

export const mainMenuKeyboard = Markup.keyboard([
  ["✍️ Matnni tekshirish", "📝 Matnni tahrirlash"],
  ["📚 Grammatika", "🔤 So'z izohi"],
  ["🔄 Tarjima", "🎓 Test"],
  ["🤖 AI yordamchi", "🎤 Ovoz → Matn"],
  ["🔊 Matn → Ovoz", "ℹ️ Loyiha haqida"],
]).resize();