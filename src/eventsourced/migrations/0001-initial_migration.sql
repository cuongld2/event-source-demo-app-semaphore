CREATE SCHEMA "eventsourcing";

CREATE TABLE
  "eventsourcing"."user" (
    "id" BIGSERIAL PRIMARY KEY,
    "username" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "fullName" VARCHAR(100) NOT NULL
  );


