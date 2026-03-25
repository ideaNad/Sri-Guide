START TRANSACTION;
CREATE TABLE "EventCategories" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Icon" text,
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_EventCategories" PRIMARY KEY ("Id")
);

CREATE TABLE "EventOrganizerProfiles" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "OrganizationName" text NOT NULL,
    "Bio" text,
    "Website" text,
    "FacebookUrl" text,
    "InstagramUrl" text,
    "TwitterUrl" text,
    "IsVerified" boolean NOT NULL,
    "VerificationDetails" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_EventOrganizerProfiles" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_EventOrganizerProfiles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "EventCategoryFields" (
    "Id" uuid NOT NULL,
    "CategoryId" uuid NOT NULL,
    "FieldLabel" text NOT NULL,
    "FieldName" text NOT NULL,
    "FieldType" text NOT NULL,
    "OptionsJson" text,
    "IsRequired" boolean NOT NULL,
    "SortOrder" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_EventCategoryFields" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_EventCategoryFields_EventCategories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "EventCategories" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Events" (
    "Id" uuid NOT NULL,
    "Title" text NOT NULL,
    "ShortDescription" text NOT NULL,
    "FullDescription" text NOT NULL,
    "CategoryId" uuid NOT NULL,
    "OrganizerProfileId" uuid NOT NULL,
    "EventType" text NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone NOT NULL,
    "StartTime" text,
    "EndTime" text,
    "LocationName" text NOT NULL,
    "District" text,
    "MapLocation" text,
    "Price" numeric NOT NULL,
    "Currency" text NOT NULL,
    "MaxParticipants" integer NOT NULL,
    "CoverImage" text,
    "GalleryImages" text,
    "IsPublished" boolean NOT NULL,
    "IsCancelled" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Events" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Events_EventCategories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "EventCategories" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Events_EventOrganizerProfiles_OrganizerProfileId" FOREIGN KEY ("OrganizerProfileId") REFERENCES "EventOrganizerProfiles" ("Id") ON DELETE CASCADE
);

CREATE TABLE "EventFieldValues" (
    "Id" uuid NOT NULL,
    "EventId" uuid NOT NULL,
    "FieldId" uuid NOT NULL,
    "Value" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_EventFieldValues" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_EventFieldValues_EventCategoryFields_FieldId" FOREIGN KEY ("FieldId") REFERENCES "EventCategoryFields" ("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_EventFieldValues_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_EventCategoryFields_CategoryId" ON "EventCategoryFields" ("CategoryId");

CREATE INDEX "IX_EventFieldValues_EventId" ON "EventFieldValues" ("EventId");

CREATE INDEX "IX_EventFieldValues_FieldId" ON "EventFieldValues" ("FieldId");

CREATE UNIQUE INDEX "IX_EventOrganizerProfiles_UserId" ON "EventOrganizerProfiles" ("UserId");

CREATE INDEX "IX_Events_CategoryId" ON "Events" ("CategoryId");

CREATE INDEX "IX_Events_OrganizerProfileId" ON "Events" ("OrganizerProfileId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260325073951_AddEventSystem', '9.0.0');

COMMIT;

