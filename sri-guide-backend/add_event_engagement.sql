-- Migration: FixOrganizerRoles (20260325101035_FixOrganizerRoles)
-- Corrects user roles for existing organizers
UPDATE "Users" 
SET "Role" = 7 
WHERE "Role" = 6 
AND EXISTS (SELECT 1 FROM "EventOrganizerProfiles" WHERE "UserId" = "Users"."Id");

-- Migration: AddEventEngagement (20260325115103_AddEventEngagement)
-- Creates tables for Event Likes and Reviews

CREATE TABLE IF NOT EXISTS "EventLikes" (
    "Id" uuid NOT NULL,
    "EventId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NULL,
    CONSTRAINT "PK_EventLikes" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_EventLikes_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_EventLikes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "EventReviews" (
    "Id" uuid NOT NULL,
    "EventId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Rating" integer NOT NULL,
    "Comment" text NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NULL,
    CONSTRAINT "PK_EventReviews" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_EventReviews_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_EventReviews_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

-- Indexes for performance and uniqueness
CREATE INDEX IF NOT EXISTS "IX_EventLikes_EventId" ON "EventLikes" ("EventId");
CREATE UNIQUE INDEX IF NOT EXISTS "IX_EventLikes_UserId_EventId" ON "EventLikes" ("UserId", "EventId");
CREATE INDEX IF NOT EXISTS "IX_EventReviews_EventId" ON "EventReviews" ("EventId");
CREATE INDEX IF NOT EXISTS "IX_EventReviews_UserId" ON "EventReviews" ("UserId");

-- Register migrations in EF History
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
SELECT '20260325101035_FixOrganizerRoles', '9.0.0'
WHERE NOT EXISTS (SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325101035_FixOrganizerRoles');

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
SELECT '20260325115103_AddEventEngagement', '9.0.0'
WHERE NOT EXISTS (SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325115103_AddEventEngagement');
