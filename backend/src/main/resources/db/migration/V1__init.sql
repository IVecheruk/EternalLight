CREATE TABLE IF NOT EXISTS healthcheck (
                                           id BIGSERIAL PRIMARY KEY,
                                           created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

INSERT INTO healthcheck DEFAULT VALUES;
