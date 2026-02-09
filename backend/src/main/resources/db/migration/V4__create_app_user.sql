CREATE TABLE IF NOT EXISTS app_user (
                                        user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                        email VARCHAR(120) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(60) NOT NULL
    );
