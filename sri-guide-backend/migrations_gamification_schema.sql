START TRANSACTION;
ALTER TABLE "Users" ADD "CurrentTitle" text;

ALTER TABLE "Users" ADD "Level" integer NOT NULL DEFAULT 0;

ALTER TABLE "Users" ADD "XP" integer NOT NULL DEFAULT 0;

CREATE TABLE "Badges" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Description" text NOT NULL,
    "IconUrl" text NOT NULL,
    "Level" integer NOT NULL,
    "Criteria" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Badges" PRIMARY KEY ("Id")
);

CREATE TABLE "Quests" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Description" text NOT NULL,
    "LocationName" text,
    "Latitude" double precision NOT NULL,
    "Longitude" double precision NOT NULL,
    "ProximityRadiusInMeters" double precision NOT NULL,
    "Category" integer NOT NULL,
    "Difficulty" integer NOT NULL,
    "EstimatedTime" text,
    "RewardXP" integer NOT NULL,
    "RewardBadgeId" uuid,
    "RewardTitle" text,
    "PhotoRequirement" text NOT NULL,
    "IsActive" boolean NOT NULL,
    "IconUrl" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Quests" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Quests_Badges_RewardBadgeId" FOREIGN KEY ("RewardBadgeId") REFERENCES "Badges" ("Id") ON DELETE SET NULL
);

CREATE TABLE "UserBadges" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "BadgeId" uuid NOT NULL,
    "EarnedDate" timestamp with time zone NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_UserBadges" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_UserBadges_Badges_BadgeId" FOREIGN KEY ("BadgeId") REFERENCES "Badges" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_UserBadges_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "QuestSubmissions" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "QuestId" uuid NOT NULL,
    "PhotoProofUrl" text NOT NULL,
    "SubmissionLatitude" double precision,
    "SubmissionLongitude" double precision,
    "Status" integer NOT NULL,
    "SubmissionDate" timestamp with time zone NOT NULL,
    "ReviewerNotes" text,
    "EarnedXP" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_QuestSubmissions" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_QuestSubmissions_Quests_QuestId" FOREIGN KEY ("QuestId") REFERENCES "Quests" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_QuestSubmissions_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Quests_RewardBadgeId" ON "Quests" ("RewardBadgeId");

CREATE INDEX "IX_QuestSubmissions_QuestId" ON "QuestSubmissions" ("QuestId");

CREATE INDEX "IX_QuestSubmissions_UserId" ON "QuestSubmissions" ("UserId");

CREATE INDEX "IX_UserBadges_BadgeId" ON "UserBadges" ("BadgeId");

CREATE INDEX "IX_UserBadges_UserId" ON "UserBadges" ("UserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260403104327_AddGamificationSystem', '9.0.0');

COMMIT;

