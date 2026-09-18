# TilAI — Arxitektura

[Telegram User] -> [Bot (Telegraf)] va [Mini App (React)] -> [Backend API (Express)]
Backend ichida: Auth, Users, AI service, Quiz, Admin modullari
Backend -> PostgreSQL, Redis, tashqi AI API

Muhim tamoyil: Bot va Mini App hech qachon to'g'ridan-to'g'ri DB yoki AI API bilan
gaplashmaydi — faqat Backend API orqali. Shu tufayli maxfiy narsalar (AI kaliti,
DB parol) faqat backendda qoladi.

## Papka strukturasi

tilai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── spellcheck/
│   │   │   ├── grammar/
│   │   │   ├── rewrite/
│   │   │   ├── dictionary/
│   │   │   ├── translate/
│   │   │   ├── quiz/
│   │   │   ├── ai/
│   │   │   ├── voice/
│   │   │   ├── admin/
│   │   │   └── security/
│   │   ├── middlewares/
│   │   ├── database/prisma/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── bot/
│   ├── src/{handlers,middlewares,keyboards}/
│   ├── package.json
│   └── Dockerfile
├── miniapp/
│   ├── src/{pages,components,api}/
│   ├── package.json
│   └── Dockerfile
├── docs/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md