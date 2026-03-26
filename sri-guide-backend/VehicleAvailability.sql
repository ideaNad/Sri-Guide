CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE "Users" (
    "Id" uuid NOT NULL,
    "FullName" text NOT NULL,
    "Email" text NOT NULL,
    "PasswordHash" text NOT NULL,
    "PhoneNumber" text,
    "ProfileImageUrl" text,
    "Role" integer NOT NULL,
    "IsVerified" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

CREATE TABLE "AgencyProfiles" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CompanyName" text NOT NULL,
    "CompanyEmail" text,
    "RegistrationNumber" text,
    "Phone" text,
    "WhatsApp" text,
    "VerificationStatus" integer NOT NULL,
    "IsVerified" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_AgencyProfiles" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AgencyProfiles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Reviews" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "TargetId" uuid NOT NULL,
    "TargetType" text NOT NULL,
    "Rating" integer NOT NULL,
    "Comment" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Reviews" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Reviews_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "GuideProfiles" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Bio" text NOT NULL,
    "Languages" text[] NOT NULL,
    "LicenseNumber" text,
    "Specialty" text,
    "DailyRate" numeric,
    "HourlyRate" numeric,
    "VerificationStatus" integer NOT NULL,
    "IsVerified" boolean NOT NULL,
    "AgencyId" uuid,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_GuideProfiles" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_GuideProfiles_AgencyProfiles_AgencyId" FOREIGN KEY ("AgencyId") REFERENCES "AgencyProfiles" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_GuideProfiles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "IX_AgencyProfiles_UserId" ON "AgencyProfiles" ("UserId");

CREATE INDEX "IX_GuideProfiles_AgencyId" ON "GuideProfiles" ("AgencyId");

CREATE UNIQUE INDEX "IX_GuideProfiles_UserId" ON "GuideProfiles" ("UserId");

CREATE INDEX "IX_Reviews_UserId" ON "Reviews" ("UserId");

CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260318170849_InitialCreate', '9.0.0');

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260318174353_UpdateNavigationProperties', '9.0.0');

ALTER TABLE "GuideProfiles" ADD "IsLegit" boolean NOT NULL DEFAULT FALSE;

ALTER TABLE "GuideProfiles" ADD "LicenseExpirationDate" timestamp with time zone;

ALTER TABLE "GuideProfiles" ADD "RegistrationNumber" text;

CREATE TABLE "Bookings" (
    "Id" uuid NOT NULL,
    "GuideId" uuid NOT NULL,
    "CustomerId" uuid NOT NULL,
    "BookingDate" timestamp with time zone NOT NULL,
    "Status" integer NOT NULL,
    "TotalAmount" numeric NOT NULL,
    "Notes" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Bookings" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Bookings_Users_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Users" ("Id"),
    CONSTRAINT "FK_Bookings_Users_GuideId" FOREIGN KEY ("GuideId") REFERENCES "Users" ("Id")
);

CREATE TABLE "Trips" (
    "Id" uuid NOT NULL,
    "GuideId" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "Location" text NOT NULL,
    "Date" timestamp with time zone,
    "GuideProfileId" uuid,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Trips" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Trips_GuideProfiles_GuideProfileId" FOREIGN KEY ("GuideProfileId") REFERENCES "GuideProfiles" ("Id"),
    CONSTRAINT "FK_Trips_Users_GuideId" FOREIGN KEY ("GuideId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "TripImages" (
    "Id" uuid NOT NULL,
    "TripId" uuid NOT NULL,
    "ImageUrl" text NOT NULL,
    "Caption" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TripImages" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TripImages_Trips_TripId" FOREIGN KEY ("TripId") REFERENCES "Trips" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Bookings_CustomerId" ON "Bookings" ("CustomerId");

CREATE INDEX "IX_Bookings_GuideId" ON "Bookings" ("GuideId");

CREATE INDEX "IX_TripImages_TripId" ON "TripImages" ("TripId");

CREATE INDEX "IX_Trips_GuideId" ON "Trips" ("GuideId");

CREATE INDEX "IX_Trips_GuideProfileId" ON "Trips" ("GuideProfileId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260319112013_AddGuideDashboardFeatures', '9.0.0');

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260319131330_AddTripEnhancements', '9.0.0');

ALTER TABLE "GuideProfiles" ADD "ContactForPrice" boolean NOT NULL DEFAULT FALSE;

CREATE TABLE "TripLikes" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "TripId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TripLikes" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TripLikes_Trips_TripId" FOREIGN KEY ("TripId") REFERENCES "Trips" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_TripLikes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_TripLikes_TripId" ON "TripLikes" ("TripId");

CREATE UNIQUE INDEX "IX_TripLikes_UserId_TripId" ON "TripLikes" ("UserId", "TripId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260319163155_Phase3_Pricing_Likes', '9.0.0');

ALTER TABLE "GuideProfiles" ADD "FacebookLink" text;

ALTER TABLE "GuideProfiles" ADD "InstagramLink" text;

ALTER TABLE "GuideProfiles" ADD "PhoneNumber" text;

ALTER TABLE "GuideProfiles" ADD "TikTokLink" text;

ALTER TABLE "GuideProfiles" ADD "WhatsAppNumber" text;

ALTER TABLE "GuideProfiles" ADD "YouTubeLink" text;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260319171052_AddGuideSocialLinks', '9.0.0');

ALTER TABLE "GuideProfiles" RENAME COLUMN "Specialty" TO "TwitterLink";

ALTER TABLE "GuideProfiles" ADD "LinkedinLink" text;

ALTER TABLE "GuideProfiles" ADD "OperatingAreas" text[];

ALTER TABLE "GuideProfiles" ADD "Specialties" text[];

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260320044553_AddGuideFieldsNullable', '9.0.0');

ALTER TABLE "Bookings" ADD "TripId" uuid;

CREATE INDEX "IX_Bookings_TripId" ON "Bookings" ("TripId");

ALTER TABLE "Bookings" ADD CONSTRAINT "FK_Bookings_Trips_TripId" FOREIGN KEY ("TripId") REFERENCES "Trips" ("Id");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260320121205_AddTripToBooking', '9.0.0');

ALTER TABLE "Trips" ADD "AgencyId" uuid;

ALTER TABLE "Trips" ADD "Category" text;

ALTER TABLE "Trips" ADD "IsAgencyTour" boolean NOT NULL DEFAULT FALSE;

ALTER TABLE "Trips" ADD "Price" numeric NOT NULL DEFAULT 0.0;

CREATE TABLE "ItinerarySteps" (
    "Id" uuid NOT NULL,
    "TripId" uuid NOT NULL,
    "Time" text NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "ImageUrl" text,
    "Order" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_ItinerarySteps" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_ItinerarySteps_Trips_TripId" FOREIGN KEY ("TripId") REFERENCES "Trips" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_Trips_AgencyId" ON "Trips" ("AgencyId");

CREATE INDEX "IX_ItinerarySteps_TripId" ON "ItinerarySteps" ("TripId");

ALTER TABLE "Trips" ADD CONSTRAINT "FK_Trips_AgencyProfiles_AgencyId" FOREIGN KEY ("AgencyId") REFERENCES "AgencyProfiles" ("Id") ON DELETE SET NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260320175347_AddTourPlannerAndAgencyTrips', '9.0.0');

ALTER TABLE "AgencyProfiles" ADD "Bio" text;

ALTER TABLE "AgencyProfiles" ADD "FacebookLink" text;

ALTER TABLE "AgencyProfiles" ADD "InstagramLink" text;

ALTER TABLE "AgencyProfiles" ADD "LinkedinLink" text;

ALTER TABLE "AgencyProfiles" ADD "TikTokLink" text;

ALTER TABLE "AgencyProfiles" ADD "TwitterLink" text;

ALTER TABLE "AgencyProfiles" ADD "YouTubeLink" text;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260320181715_AddAgencySocialLinksAndBio', '9.0.0');

ALTER TABLE "GuideProfiles" ADD "AgencyRecruitmentStatus" integer NOT NULL DEFAULT 0;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260320191133_AddRecruitmentStatus', '9.0.0');

ALTER TABLE "Trips" DROP CONSTRAINT "FK_Trips_Users_GuideId";

ALTER TABLE "Trips" ALTER COLUMN "GuideId" DROP NOT NULL;

ALTER TABLE "Trips" ADD CONSTRAINT "FK_Trips_Users_GuideId" FOREIGN KEY ("GuideId") REFERENCES "Users" ("Id");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260320215018_MakeTripGuideIdNullable', '9.0.0');

ALTER TABLE "Trips" ADD "Duration" text;

ALTER TABLE "Trips" ADD "IsActive" boolean NOT NULL DEFAULT FALSE;

ALTER TABLE "Trips" ADD "MapLink" text;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260321065558_AddTripExtraFields', '9.0.0');

ALTER TABLE "ItinerarySteps" ADD "DayNumber" integer NOT NULL DEFAULT 0;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260321074401_AddDayNumberToItineraryStep', '9.0.0');

CREATE TABLE "Feedbacks" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Email" text NOT NULL,
    "Subject" text NOT NULL,
    "Message" text NOT NULL,
    "IsReviewed" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Feedbacks" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260321094651_AddFeedbackTable', '9.0.0');

CREATE TABLE "TripDays" (
    "Id" uuid NOT NULL,
    "TripId" uuid NOT NULL,
    "DayNumber" integer NOT NULL,
    "Description" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TripDays" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TripDays_Trips_TripId" FOREIGN KEY ("TripId") REFERENCES "Trips" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_TripDays_TripId" ON "TripDays" ("TripId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260321105209_AddTripDayDescription', '9.0.0');

ALTER TABLE "TripDays" ADD "ImageUrl" text;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260321110728_AddTripDayImageUrl', '9.0.0');

CREATE TABLE "Tours" (
    "Id" uuid NOT NULL,
    "AgencyId" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "Location" text NOT NULL,
    "Category" text,
    "Duration" text,
    "MapLink" text,
    "Price" numeric NOT NULL,
    "MainImageUrl" text,
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Tours" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Tours_AgencyProfiles_AgencyId" FOREIGN KEY ("AgencyId") REFERENCES "AgencyProfiles" ("Id") ON DELETE CASCADE
);

CREATE TABLE "TourDays" (
    "Id" uuid NOT NULL,
    "TourId" uuid NOT NULL,
    "DayNumber" integer NOT NULL,
    "Description" text NOT NULL,
    "ImageUrl" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TourDays" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TourDays_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES "Tours" ("Id") ON DELETE CASCADE
);

CREATE TABLE "TourImages" (
    "Id" uuid NOT NULL,
    "TourId" uuid NOT NULL,
    "ImageUrl" text NOT NULL,
    "Caption" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TourImages" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TourImages_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES "Tours" ("Id") ON DELETE CASCADE
);

CREATE TABLE "TourItinerarySteps" (
    "Id" uuid NOT NULL,
    "TourId" uuid NOT NULL,
    "Time" text NOT NULL,
    "Title" text NOT NULL,
    "Description" text NOT NULL,
    "ImageUrl" text,
    "DayNumber" integer NOT NULL,
    "Order" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TourItinerarySteps" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TourItinerarySteps_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES "Tours" ("Id") ON DELETE CASCADE
);

CREATE TABLE "TourLikes" (
    "Id" uuid NOT NULL,
    "TourId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TourLikes" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TourLikes_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES "Tours" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_TourLikes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

INSERT INTO "Tours" ("Id", "AgencyId", "Title", "Description", "Location", "Category", "Duration", "MapLink", "Price", "MainImageUrl", "IsActive", "CreatedAt", "UpdatedAt") SELECT "Id", "AgencyId", "Title", "Description", "Location", "Category", "Duration", "MapLink", "Price", NULL, "IsActive", "CreatedAt", "UpdatedAt" FROM "Trips" WHERE "IsAgencyTour" = true

INSERT INTO "TourDays" ("Id", "TourId", "DayNumber", "Description", "ImageUrl", "CreatedAt", "UpdatedAt") SELECT "Id", "TripId", "DayNumber", "Description", "ImageUrl", "CreatedAt", "UpdatedAt" FROM "TripDays" WHERE "TripId" IN (SELECT "Id" FROM "Trips" WHERE "IsAgencyTour" = true)

INSERT INTO "TourItinerarySteps" ("Id", "TourId", "Time", "Title", "Description", "ImageUrl", "DayNumber", "Order", "CreatedAt", "UpdatedAt") SELECT "Id", "TripId", "Time", "Title", "Description", "ImageUrl", "DayNumber", "Order", "CreatedAt", "UpdatedAt" FROM "ItinerarySteps" WHERE "TripId" IN (SELECT "Id" FROM "Trips" WHERE "IsAgencyTour" = true)

ALTER TABLE "Bookings" DROP CONSTRAINT "FK_Bookings_Trips_TripId";

ALTER TABLE "Bookings" RENAME COLUMN "TripId" TO "TourId";

ALTER INDEX "IX_Bookings_TripId" RENAME TO "IX_Bookings_TourId";

ALTER TABLE "Bookings" ADD CONSTRAINT "FK_Bookings_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES "Tours" ("Id") ON DELETE SET NULL;

UPDATE "Bookings" SET "TourId" = NULL WHERE "TourId" NOT IN (SELECT "Id" FROM "Tours")

DROP TABLE "ItinerarySteps";

DROP TABLE "TripDays";

ALTER TABLE "Trips" DROP COLUMN "Category";

ALTER TABLE "Trips" DROP COLUMN "Duration";

ALTER TABLE "Trips" DROP COLUMN "IsAgencyTour";

ALTER TABLE "Trips" DROP COLUMN "Price";

ALTER TABLE "Trips" RENAME COLUMN "MapLink" TO "MainImageUrl";

ALTER TABLE "Trips" ADD "ViewCount" integer NOT NULL DEFAULT 0;

CREATE INDEX "IX_TourDays_TourId" ON "TourDays" ("TourId");

CREATE INDEX "IX_TourImages_TourId" ON "TourImages" ("TourId");

CREATE INDEX "IX_TourItinerarySteps_TourId" ON "TourItinerarySteps" ("TourId");

CREATE INDEX "IX_TourLikes_TourId" ON "TourLikes" ("TourId");

CREATE UNIQUE INDEX "IX_TourLikes_UserId_TourId" ON "TourLikes" ("UserId", "TourId");

CREATE INDEX "IX_Tours_AgencyId" ON "Tours" ("AgencyId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260321133046_SeparateToursAndTripsFinal', '9.0.0');

ALTER TABLE "Bookings" ADD "Guests" integer NOT NULL DEFAULT 0;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260321140355_AddGuestsToBooking', '9.0.0');

CREATE TABLE "Inquiries" (
    "Id" uuid NOT NULL,
    "FullName" text NOT NULL,
    "Email" text NOT NULL,
    "Subject" text NOT NULL,
    "Message" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Inquiries" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260321224258_AddInquiryTable', '9.0.0');

ALTER TABLE "Users" ADD "PasswordResetToken" text;

ALTER TABLE "Users" ADD "ResetTokenExpires" timestamp with time zone;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260321230319_AddUserPasswordResetFields', '9.0.0');

CREATE TABLE "PopularPlaces" (
    "Id" uuid NOT NULL,
    "Title" character varying(200) NOT NULL,
    "Description" text NOT NULL,
    "ImageUrl" text NOT NULL,
    "ViewCount" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_PopularPlaces" PRIMARY KEY ("Id")
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260322094440_AddPopularPlaces', '9.0.0');

ALTER TABLE "PopularPlaces" ADD "MapLink" text;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260322095138_AddMapLinkToPopularPlace', '9.0.0');

ALTER TABLE "Users" ADD "Slug" text;

ALTER TABLE "Trips" ADD "Slug" text;

ALTER TABLE "Tours" ADD "Slug" text;

ALTER TABLE "PopularPlaces" ADD "Slug" text;

ALTER TABLE "AgencyProfiles" ADD "Slug" text;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260322103003_AddSlugsToEntities', '9.0.0');

ALTER TABLE "Users" ADD "Budget" text;

ALTER TABLE "Users" ADD "Interests" text;

ALTER TABLE "Users" ADD "OnboardingCompleted" boolean NOT NULL DEFAULT FALSE;

ALTER TABLE "Users" ADD "PreferredLocation" text;

ALTER TABLE "Users" ADD "TravelDuration" text;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260322132122_AddUserOnboardingFields', '9.0.0');

ALTER TABLE "AgencyProfiles" ADD "CompanyAddress" text;

ALTER TABLE "AgencyProfiles" ADD "Languages" text[];

ALTER TABLE "AgencyProfiles" ADD "OperatingRegions" text[];

ALTER TABLE "AgencyProfiles" ADD "Specialties" text[];

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260324112958_AddAgencyProfileFields', '9.0.0');

UPDATE "AgencyProfiles" SET "Languages" = '{}' WHERE "Languages" IS NULL;

UPDATE "AgencyProfiles" SET "Specialties" = '{}' WHERE "Specialties" IS NULL;

UPDATE "AgencyProfiles" SET "OperatingRegions" = '{}' WHERE "OperatingRegions" IS NULL;

UPDATE "GuideProfiles" SET "Languages" = '{}' WHERE "Languages" IS NULL;

ALTER TABLE "GuideProfiles" ALTER COLUMN "Languages" DROP NOT NULL;

ALTER TABLE "AgencyProfiles" ALTER COLUMN "Specialties" DROP NOT NULL;

ALTER TABLE "AgencyProfiles" ALTER COLUMN "OperatingRegions" DROP NOT NULL;

ALTER TABLE "AgencyProfiles" ALTER COLUMN "Languages" DROP NOT NULL;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260324114650_EnsureAgencyProfileListDefaults', '9.0.0');

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

ALTER TABLE "EventOrganizerProfiles" RENAME COLUMN "TwitterUrl" TO "YouTubeLink";

ALTER TABLE "EventOrganizerProfiles" RENAME COLUMN "InstagramUrl" TO "TwitterLink";

ALTER TABLE "EventOrganizerProfiles" RENAME COLUMN "FacebookUrl" TO "TikTokLink";

ALTER TABLE "EventOrganizerProfiles" ADD "FacebookLink" text;

ALTER TABLE "EventOrganizerProfiles" ADD "InstagramLink" text;

ALTER TABLE "EventOrganizerProfiles" ADD "Languages" text[];

ALTER TABLE "EventOrganizerProfiles" ADD "LinkedinLink" text;

ALTER TABLE "EventOrganizerProfiles" ADD "OperatingAreas" text[];

ALTER TABLE "EventOrganizerProfiles" ADD "Specialties" text[];

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260325093015_ExpandOrganizerProfile', '9.0.0');

UPDATE "Users" SET "Role" = 7 WHERE "Role" = 6 AND EXISTS (SELECT 1 FROM "EventOrganizerProfiles" WHERE "UserId" = "Users"."Id");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260325101035_FixOrganizerRoles', '9.0.0');

CREATE TABLE "EventLikes" (
    "Id" uuid NOT NULL,
    "EventId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_EventLikes" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_EventLikes_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_EventLikes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "EventReviews" (
    "Id" uuid NOT NULL,
    "EventId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Rating" integer NOT NULL,
    "Comment" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_EventReviews" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_EventReviews_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_EventReviews_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_EventLikes_EventId" ON "EventLikes" ("EventId");

CREATE UNIQUE INDEX "IX_EventLikes_UserId_EventId" ON "EventLikes" ("UserId", "EventId");

CREATE INDEX "IX_EventReviews_EventId" ON "EventReviews" ("EventId");

CREATE INDEX "IX_EventReviews_UserId" ON "EventReviews" ("UserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260325115103_AddEventEngagement', '9.0.0');

CREATE TABLE "TransportProfiles" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "BusinessName" text NOT NULL,
    "Description" text,
    "Phone" text,
    "ProfileImageUrl" text,
    "District" text,
    "Province" text,
    "Latitude" double precision,
    "Longitude" double precision,
    "IsAvailable" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_TransportProfiles" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_TransportProfiles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Vehicles" (
    "Id" uuid NOT NULL,
    "TransportProfileId" uuid NOT NULL,
    "VehicleType" text NOT NULL,
    "Brand" text NOT NULL,
    "Model" text NOT NULL,
    "Year" integer NOT NULL,
    "PassengerCapacity" integer NOT NULL,
    "LuggageCapacity" integer NOT NULL,
    "HasAc" boolean NOT NULL,
    "VehicleImageUrl" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Vehicles" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Vehicles_TransportProfiles_TransportProfileId" FOREIGN KEY ("TransportProfileId") REFERENCES "TransportProfiles" ("Id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "IX_TransportProfiles_UserId" ON "TransportProfiles" ("UserId");

CREATE INDEX "IX_Vehicles_TransportProfileId" ON "Vehicles" ("TransportProfileId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260326065609_AddTransportProvider', '9.0.0');

CREATE TABLE "VehicleLikes" (
    "Id" uuid NOT NULL,
    "VehicleId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_VehicleLikes" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_VehicleLikes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_VehicleLikes_Vehicles_VehicleId" FOREIGN KEY ("VehicleId") REFERENCES "Vehicles" ("Id") ON DELETE CASCADE
);

CREATE TABLE "VehicleReviews" (
    "Id" uuid NOT NULL,
    "VehicleId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Rating" integer NOT NULL,
    "Comment" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_VehicleReviews" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_VehicleReviews_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_VehicleReviews_Vehicles_VehicleId" FOREIGN KEY ("VehicleId") REFERENCES "Vehicles" ("Id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "IX_VehicleLikes_UserId_VehicleId" ON "VehicleLikes" ("UserId", "VehicleId");

CREATE INDEX "IX_VehicleLikes_VehicleId" ON "VehicleLikes" ("VehicleId");

CREATE INDEX "IX_VehicleReviews_UserId" ON "VehicleReviews" ("UserId");

CREATE INDEX "IX_VehicleReviews_VehicleId" ON "VehicleReviews" ("VehicleId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260326073318_AddVehicleEngagement', '9.0.0');

ALTER TABLE "Vehicles" ADD "IsAvailable" boolean NOT NULL DEFAULT FALSE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260326084943_AddVehicleAvailability', '9.0.0');

COMMIT;

