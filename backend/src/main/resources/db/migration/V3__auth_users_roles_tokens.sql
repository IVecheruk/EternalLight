-- =====================================================================
-- AUTH: users / roles / refresh tokens
-- =====================================================================

-- ВАЖНО: мы работаем в схеме gorsvet (как у тебя)
CREATE TABLE IF NOT EXISTS app_user (
                                        user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                        email TEXT NOT NULL UNIQUE,
                                        password_hash TEXT NOT NULL,
                                        is_active BOOLEAN NOT NULL DEFAULT TRUE,
                                        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

CREATE TABLE IF NOT EXISTS app_role (
                                        role_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                        code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS app_user_role (
                                             user_id BIGINT NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES app_role(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
    );

-- Refresh token храним в БД (можно отзывать)
CREATE TABLE IF NOT EXISTS refresh_token (
                                             refresh_token_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                             user_id BIGINT NOT NULL REFERENCES app_user(user_id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

CREATE INDEX IF NOT EXISTS idx_refresh_token_user_id ON refresh_token(user_id);

-- Справочные роли
INSERT INTO app_role(code) VALUES ('ADMIN')
    ON CONFLICT (code) DO NOTHING;

INSERT INTO app_role(code) VALUES ('USER')
    ON CONFLICT (code) DO NOTHING;

-- Тестовый админ (пароль будет задаваться в коде/seed позже)
-- Здесь не вставляем пароль, чтобы не хранить в миграции
