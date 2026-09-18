CREATE TYPE user_role AS ENUM ('USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN');

CREATE TABLE users (
    id                BIGSERIAL PRIMARY KEY,
    telegram_id       BIGINT UNIQUE NOT NULL,
    username          VARCHAR(64),
    first_name        VARCHAR(128),
    language          VARCHAR(8) DEFAULT 'uz',
    role              user_role NOT NULL DEFAULT 'USER',
    registered_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_activity_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_blocked        BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);

CREATE TABLE feature_usage (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feature     VARCHAR(64) NOT NULL,
    used_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_feature_usage_user ON feature_usage(user_id);
CREATE INDEX idx_feature_usage_feature ON feature_usage(feature);

CREATE TABLE quiz_results (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id     VARCHAR(64) NOT NULL,
    score       INTEGER NOT NULL,
    max_score   INTEGER NOT NULL,
    taken_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_quiz_results_user ON quiz_results(user_id);

CREATE TABLE security_events (
    id          BIGSERIAL PRIMARY KEY,
    event_type  VARCHAR(64) NOT NULL,
    user_id     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    ip_hash     VARCHAR(128),
    endpoint    VARCHAR(256),
    details     JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_created ON security_events(created_at);

CREATE TABLE admin_audit_log (
    id          BIGSERIAL PRIMARY KEY,
    admin_id    BIGINT NOT NULL REFERENCES users(id),
    action      VARCHAR(128) NOT NULL,
    target      VARCHAR(256),
    ip_hash     VARCHAR(128),
    result      VARCHAR(32) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE request_logs (
    id              BIGSERIAL PRIMARY KEY,
    ip_hash         VARCHAR(128) NOT NULL,
    method          VARCHAR(8) NOT NULL,
    endpoint        VARCHAR(256) NOT NULL,
    status_code     INTEGER NOT NULL,
    user_id         BIGINT REFERENCES users(id) ON DELETE SET NULL,
    user_agent      VARCHAR(512),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_request_logs_created ON request_logs(created_at);