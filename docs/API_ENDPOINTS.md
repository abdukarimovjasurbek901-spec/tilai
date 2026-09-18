# API Endpoints (/api/v1)

🔓 ochiq   🔐 auth talab   👮 admin talab

POST   /auth/telegram          🔓 initData tekshirish, JWT qaytarish
POST   /auth/refresh           🔐 token yangilash

GET    /users/me               🔐 o'z profili
GET    /users/me/stats         🔐 o'z statistikasi

POST   /spellcheck             🔐 imlo tekshirish
POST   /grammar/check          🔐 grammatika tekshirish
POST   /rewrite                🔐 adabiy tilga tahrirlash
POST   /dictionary/lookup      🔐 so'z izohi
POST   /translate              🔐 tarjima
POST   /voice/speech-to-text   🔐 ovozdan matnga
POST   /voice/text-to-speech   🔐 matndan ovozga
POST   /ai/assistant           🔐 AI yordamchi (qattiq rate-limit)

GET    /quiz                   🔐 testlar ro'yxati
GET    /quiz/:id               🔐 test tafsiloti
POST   /quiz/:id/submit        🔐 natija yuborish
GET    /quiz/leaderboard       🔐 reyting

GET    /admin/users            👮
PATCH  /admin/users/:id        👮
GET    /admin/security-events  👮
GET    /admin/rate-limits      👮
GET    /admin/audit-log        👮
GET    /admin/stats            👮