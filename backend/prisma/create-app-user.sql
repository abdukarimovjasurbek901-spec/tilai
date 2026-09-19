-- Production'da "postgres" superuser bilan emas, cheklangan huquqli
-- alohida user bilan ulanish tavsiya etiladi.
CREATE USER tilai_app WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';

GRANT CONNECT ON DATABASE tilai_db TO tilai_app;
GRANT USAGE ON SCHEMA public TO tilai_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO tilai_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tilai_app;

-- Kelajakda yaratiladigan jadvallarga ham avtomatik huquq berish
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO tilai_app;

-- tilai_app hech qachon DROP TABLE, CREATE TABLE huquqiga ega bo'lmaydi —
-- schema o'zgarishlari faqat migratsiya paytida admin user orqali bo'ladi.