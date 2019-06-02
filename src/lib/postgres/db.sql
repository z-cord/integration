DROP TABLE IF EXISTS webhooks;

CREATE TABLE IF NOT EXISTS webhooks (
  id                serial          PRIMARY KEY,
  owner_id          varchar(100)     UNIQUE NOT NULL,
  zeit_token        varchar(100)     UNIQUE NOT NULL,
  webhook_token     varchar(100)     UNIQUE NOT NULL,
  webhook_id        varchar(100)     UNIQUE NOT NULL,
  guild_id          varchar(100)     UNIQUE NOT NULL,
  channel_id        varchar(100)     UNIQUE NOT NULL
);