# TilAI — Xavfsizlik arxitekturasi

| Xavf | Chora |
|---|---|
| Soxta Telegram foydalanuvchi | initData HMAC tekshiruvi + auth_date muddati |
| Admin endpointga oddiy user kirishi | RBAC, faqat backend JWT claim'ga ishoniladi |
| SQL injection | Prisma ORM, raw query yo'q |
| Prompt injection | user input alohida "content", system prompt o'zgarmas |
| AI orqali maxfiy ma'lumot chiqishi | AI'ga .env/DB credentials hech qachon berilmaydi |
| Brute-force | IP + user ID + endpoint bo'yicha ko'p qatlamli rate-limit (Redis) |
| Fayl yuklash orqali malware | MIME/extension whitelist, hajm limiti, random filename |
| XSS | React auto-escape, CSP header |
| Secret leak | .gitignore + .env.example + GitHub secret scanning |

## Auth oqimi
1. Mini App initData'ni backendga yuboradi
2. Backend HMAC-SHA256 bilan bot token orqali qayta hisoblab solishtiradi
3. auth_date muddati tekshiriladi
4. Muvaffaqiyatli bo'lsa backend o'z JWT'ini chiqaradi

## RBAC
USER < MODERATOR < ADMIN < SUPER_ADMIN — rol faqat JWT claim orqali tekshiriladi.

Hech qachon "100% xavfsiz" deb da'vo qilinmaydi — real nazorat: auth, RBAC,
rate-limit, validation, audit log, monitoring.