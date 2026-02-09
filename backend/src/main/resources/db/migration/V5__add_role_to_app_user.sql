ALTER TABLE gorsvet.app_user
    ADD COLUMN IF NOT EXISTS role varchar(50) NOT NULL DEFAULT 'USER';
