CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_AgencyProfiles_UserId" ON "AgencyProfiles" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
    CREATE INDEX "IX_GuideProfiles_AgencyId" ON "GuideProfiles" ("AgencyId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_GuideProfiles_UserId" ON "GuideProfiles" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
    CREATE INDEX "IX_Reviews_UserId" ON "Reviews" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318170849_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260318170849_InitialCreate', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260318174353_UpdateNavigationProperties') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260318174353_UpdateNavigationProperties', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
    ALTER TABLE "GuideProfiles" ADD "IsLegit" boolean NOT NULL DEFAULT FALSE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
    ALTER TABLE "GuideProfiles" ADD "LicenseExpirationDate" timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
    ALTER TABLE "GuideProfiles" ADD "RegistrationNumber" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
    CREATE INDEX "IX_Bookings_CustomerId" ON "Bookings" ("CustomerId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
    CREATE INDEX "IX_Bookings_GuideId" ON "Bookings" ("GuideId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
    CREATE INDEX "IX_TripImages_TripId" ON "TripImages" ("TripId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
    CREATE INDEX "IX_Trips_GuideId" ON "Trips" ("GuideId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
    CREATE INDEX "IX_Trips_GuideProfileId" ON "Trips" ("GuideProfileId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319112013_AddGuideDashboardFeatures') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260319112013_AddGuideDashboardFeatures', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319131330_AddTripEnhancements') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260319131330_AddTripEnhancements', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319163155_Phase3_Pricing_Likes') THEN
    ALTER TABLE "GuideProfiles" ADD "ContactForPrice" boolean NOT NULL DEFAULT FALSE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319163155_Phase3_Pricing_Likes') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319163155_Phase3_Pricing_Likes') THEN
    CREATE INDEX "IX_TripLikes_TripId" ON "TripLikes" ("TripId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319163155_Phase3_Pricing_Likes') THEN
    CREATE UNIQUE INDEX "IX_TripLikes_UserId_TripId" ON "TripLikes" ("UserId", "TripId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319163155_Phase3_Pricing_Likes') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260319163155_Phase3_Pricing_Likes', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319171052_AddGuideSocialLinks') THEN
    ALTER TABLE "GuideProfiles" ADD "FacebookLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319171052_AddGuideSocialLinks') THEN
    ALTER TABLE "GuideProfiles" ADD "InstagramLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319171052_AddGuideSocialLinks') THEN
    ALTER TABLE "GuideProfiles" ADD "PhoneNumber" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319171052_AddGuideSocialLinks') THEN
    ALTER TABLE "GuideProfiles" ADD "TikTokLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319171052_AddGuideSocialLinks') THEN
    ALTER TABLE "GuideProfiles" ADD "WhatsAppNumber" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319171052_AddGuideSocialLinks') THEN
    ALTER TABLE "GuideProfiles" ADD "YouTubeLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260319171052_AddGuideSocialLinks') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260319171052_AddGuideSocialLinks', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320044553_AddGuideFieldsNullable') THEN
    ALTER TABLE "GuideProfiles" RENAME COLUMN "Specialty" TO "TwitterLink";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320044553_AddGuideFieldsNullable') THEN
    ALTER TABLE "GuideProfiles" ADD "LinkedinLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320044553_AddGuideFieldsNullable') THEN
    ALTER TABLE "GuideProfiles" ADD "OperatingAreas" text[];
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320044553_AddGuideFieldsNullable') THEN
    ALTER TABLE "GuideProfiles" ADD "Specialties" text[];
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320044553_AddGuideFieldsNullable') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260320044553_AddGuideFieldsNullable', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320121205_AddTripToBooking') THEN
    ALTER TABLE "Bookings" ADD "TripId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320121205_AddTripToBooking') THEN
    CREATE INDEX "IX_Bookings_TripId" ON "Bookings" ("TripId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320121205_AddTripToBooking') THEN
    ALTER TABLE "Bookings" ADD CONSTRAINT "FK_Bookings_Trips_TripId" FOREIGN KEY ("TripId") REFERENCES "Trips" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320121205_AddTripToBooking') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260320121205_AddTripToBooking', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320175347_AddTourPlannerAndAgencyTrips') THEN
    ALTER TABLE "Trips" ADD "AgencyId" uuid;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320175347_AddTourPlannerAndAgencyTrips') THEN
    ALTER TABLE "Trips" ADD "Category" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320175347_AddTourPlannerAndAgencyTrips') THEN
    ALTER TABLE "Trips" ADD "IsAgencyTour" boolean NOT NULL DEFAULT FALSE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320175347_AddTourPlannerAndAgencyTrips') THEN
    ALTER TABLE "Trips" ADD "Price" numeric NOT NULL DEFAULT 0.0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320175347_AddTourPlannerAndAgencyTrips') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320175347_AddTourPlannerAndAgencyTrips') THEN
    CREATE INDEX "IX_Trips_AgencyId" ON "Trips" ("AgencyId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320175347_AddTourPlannerAndAgencyTrips') THEN
    CREATE INDEX "IX_ItinerarySteps_TripId" ON "ItinerarySteps" ("TripId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320175347_AddTourPlannerAndAgencyTrips') THEN
    ALTER TABLE "Trips" ADD CONSTRAINT "FK_Trips_AgencyProfiles_AgencyId" FOREIGN KEY ("AgencyId") REFERENCES "AgencyProfiles" ("Id") ON DELETE SET NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320175347_AddTourPlannerAndAgencyTrips') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260320175347_AddTourPlannerAndAgencyTrips', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320181715_AddAgencySocialLinksAndBio') THEN
    ALTER TABLE "AgencyProfiles" ADD "Bio" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320181715_AddAgencySocialLinksAndBio') THEN
    ALTER TABLE "AgencyProfiles" ADD "FacebookLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320181715_AddAgencySocialLinksAndBio') THEN
    ALTER TABLE "AgencyProfiles" ADD "InstagramLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320181715_AddAgencySocialLinksAndBio') THEN
    ALTER TABLE "AgencyProfiles" ADD "LinkedinLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320181715_AddAgencySocialLinksAndBio') THEN
    ALTER TABLE "AgencyProfiles" ADD "TikTokLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320181715_AddAgencySocialLinksAndBio') THEN
    ALTER TABLE "AgencyProfiles" ADD "TwitterLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320181715_AddAgencySocialLinksAndBio') THEN
    ALTER TABLE "AgencyProfiles" ADD "YouTubeLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320181715_AddAgencySocialLinksAndBio') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260320181715_AddAgencySocialLinksAndBio', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320191133_AddRecruitmentStatus') THEN
    ALTER TABLE "GuideProfiles" ADD "AgencyRecruitmentStatus" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320191133_AddRecruitmentStatus') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260320191133_AddRecruitmentStatus', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320215018_MakeTripGuideIdNullable') THEN
    ALTER TABLE "Trips" DROP CONSTRAINT "FK_Trips_Users_GuideId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320215018_MakeTripGuideIdNullable') THEN
    ALTER TABLE "Trips" ALTER COLUMN "GuideId" DROP NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320215018_MakeTripGuideIdNullable') THEN
    ALTER TABLE "Trips" ADD CONSTRAINT "FK_Trips_Users_GuideId" FOREIGN KEY ("GuideId") REFERENCES "Users" ("Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260320215018_MakeTripGuideIdNullable') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260320215018_MakeTripGuideIdNullable', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321065558_AddTripExtraFields') THEN
    ALTER TABLE "Trips" ADD "Duration" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321065558_AddTripExtraFields') THEN
    ALTER TABLE "Trips" ADD "IsActive" boolean NOT NULL DEFAULT FALSE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321065558_AddTripExtraFields') THEN
    ALTER TABLE "Trips" ADD "MapLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321065558_AddTripExtraFields') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260321065558_AddTripExtraFields', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321074401_AddDayNumberToItineraryStep') THEN
    ALTER TABLE "ItinerarySteps" ADD "DayNumber" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321074401_AddDayNumberToItineraryStep') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260321074401_AddDayNumberToItineraryStep', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321094651_AddFeedbackTable') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321094651_AddFeedbackTable') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260321094651_AddFeedbackTable', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321105209_AddTripDayDescription') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321105209_AddTripDayDescription') THEN
    CREATE INDEX "IX_TripDays_TripId" ON "TripDays" ("TripId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321105209_AddTripDayDescription') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260321105209_AddTripDayDescription', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321110728_AddTripDayImageUrl') THEN
    ALTER TABLE "TripDays" ADD "ImageUrl" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321110728_AddTripDayImageUrl') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260321110728_AddTripDayImageUrl', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    INSERT INTO "Tours" ("Id", "AgencyId", "Title", "Description", "Location", "Category", "Duration", "MapLink", "Price", "MainImageUrl", "IsActive", "CreatedAt", "UpdatedAt") SELECT "Id", "AgencyId", "Title", "Description", "Location", "Category", "Duration", "MapLink", "Price", NULL, "IsActive", "CreatedAt", "UpdatedAt" FROM "Trips" WHERE "IsAgencyTour" = true
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    INSERT INTO "TourDays" ("Id", "TourId", "DayNumber", "Description", "ImageUrl", "CreatedAt", "UpdatedAt") SELECT "Id", "TripId", "DayNumber", "Description", "ImageUrl", "CreatedAt", "UpdatedAt" FROM "TripDays" WHERE "TripId" IN (SELECT "Id" FROM "Trips" WHERE "IsAgencyTour" = true)
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    INSERT INTO "TourItinerarySteps" ("Id", "TourId", "Time", "Title", "Description", "ImageUrl", "DayNumber", "Order", "CreatedAt", "UpdatedAt") SELECT "Id", "TripId", "Time", "Title", "Description", "ImageUrl", "DayNumber", "Order", "CreatedAt", "UpdatedAt" FROM "ItinerarySteps" WHERE "TripId" IN (SELECT "Id" FROM "Trips" WHERE "IsAgencyTour" = true)
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER TABLE "Bookings" DROP CONSTRAINT "FK_Bookings_Trips_TripId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER TABLE "Bookings" RENAME COLUMN "TripId" TO "TourId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER INDEX "IX_Bookings_TripId" RENAME TO "IX_Bookings_TourId";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER TABLE "Bookings" ADD CONSTRAINT "FK_Bookings_Tours_TourId" FOREIGN KEY ("TourId") REFERENCES "Tours" ("Id") ON DELETE SET NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    UPDATE "Bookings" SET "TourId" = NULL WHERE "TourId" NOT IN (SELECT "Id" FROM "Tours")
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    DROP TABLE "ItinerarySteps";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    DROP TABLE "TripDays";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER TABLE "Trips" DROP COLUMN "Category";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER TABLE "Trips" DROP COLUMN "Duration";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER TABLE "Trips" DROP COLUMN "IsAgencyTour";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER TABLE "Trips" DROP COLUMN "Price";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER TABLE "Trips" RENAME COLUMN "MapLink" TO "MainImageUrl";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    ALTER TABLE "Trips" ADD "ViewCount" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    CREATE INDEX "IX_TourDays_TourId" ON "TourDays" ("TourId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    CREATE INDEX "IX_TourImages_TourId" ON "TourImages" ("TourId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    CREATE INDEX "IX_TourItinerarySteps_TourId" ON "TourItinerarySteps" ("TourId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    CREATE INDEX "IX_TourLikes_TourId" ON "TourLikes" ("TourId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    CREATE UNIQUE INDEX "IX_TourLikes_UserId_TourId" ON "TourLikes" ("UserId", "TourId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    CREATE INDEX "IX_Tours_AgencyId" ON "Tours" ("AgencyId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321133046_SeparateToursAndTripsFinal') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260321133046_SeparateToursAndTripsFinal', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321140355_AddGuestsToBooking') THEN
    ALTER TABLE "Bookings" ADD "Guests" integer NOT NULL DEFAULT 0;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321140355_AddGuestsToBooking') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260321140355_AddGuestsToBooking', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321224258_AddInquiryTable') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321224258_AddInquiryTable') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260321224258_AddInquiryTable', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321230319_AddUserPasswordResetFields') THEN
    ALTER TABLE "Users" ADD "PasswordResetToken" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321230319_AddUserPasswordResetFields') THEN
    ALTER TABLE "Users" ADD "ResetTokenExpires" timestamp with time zone;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260321230319_AddUserPasswordResetFields') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260321230319_AddUserPasswordResetFields', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322094440_AddPopularPlaces') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322094440_AddPopularPlaces') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260322094440_AddPopularPlaces', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322095138_AddMapLinkToPopularPlace') THEN
    ALTER TABLE "PopularPlaces" ADD "MapLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322095138_AddMapLinkToPopularPlace') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260322095138_AddMapLinkToPopularPlace', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322103003_AddSlugsToEntities') THEN
    ALTER TABLE "Users" ADD "Slug" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322103003_AddSlugsToEntities') THEN
    ALTER TABLE "Trips" ADD "Slug" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322103003_AddSlugsToEntities') THEN
    ALTER TABLE "Tours" ADD "Slug" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322103003_AddSlugsToEntities') THEN
    ALTER TABLE "PopularPlaces" ADD "Slug" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322103003_AddSlugsToEntities') THEN
    ALTER TABLE "AgencyProfiles" ADD "Slug" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322103003_AddSlugsToEntities') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260322103003_AddSlugsToEntities', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322132122_AddUserOnboardingFields') THEN
    ALTER TABLE "Users" ADD "Budget" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322132122_AddUserOnboardingFields') THEN
    ALTER TABLE "Users" ADD "Interests" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322132122_AddUserOnboardingFields') THEN
    ALTER TABLE "Users" ADD "OnboardingCompleted" boolean NOT NULL DEFAULT FALSE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322132122_AddUserOnboardingFields') THEN
    ALTER TABLE "Users" ADD "PreferredLocation" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322132122_AddUserOnboardingFields') THEN
    ALTER TABLE "Users" ADD "TravelDuration" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260322132122_AddUserOnboardingFields') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260322132122_AddUserOnboardingFields', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324112958_AddAgencyProfileFields') THEN
    ALTER TABLE "AgencyProfiles" ADD "CompanyAddress" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324112958_AddAgencyProfileFields') THEN
    ALTER TABLE "AgencyProfiles" ADD "Languages" text[];
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324112958_AddAgencyProfileFields') THEN
    ALTER TABLE "AgencyProfiles" ADD "OperatingRegions" text[];
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324112958_AddAgencyProfileFields') THEN
    ALTER TABLE "AgencyProfiles" ADD "Specialties" text[];
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324112958_AddAgencyProfileFields') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260324112958_AddAgencyProfileFields', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324114650_EnsureAgencyProfileListDefaults') THEN
    UPDATE "AgencyProfiles" SET "Languages" = '{}' WHERE "Languages" IS NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324114650_EnsureAgencyProfileListDefaults') THEN
    UPDATE "AgencyProfiles" SET "Specialties" = '{}' WHERE "Specialties" IS NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324114650_EnsureAgencyProfileListDefaults') THEN
    UPDATE "AgencyProfiles" SET "OperatingRegions" = '{}' WHERE "OperatingRegions" IS NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324114650_EnsureAgencyProfileListDefaults') THEN
    UPDATE "GuideProfiles" SET "Languages" = '{}' WHERE "Languages" IS NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324114650_EnsureAgencyProfileListDefaults') THEN
    ALTER TABLE "GuideProfiles" ALTER COLUMN "Languages" DROP NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324114650_EnsureAgencyProfileListDefaults') THEN
    ALTER TABLE "AgencyProfiles" ALTER COLUMN "Specialties" DROP NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324114650_EnsureAgencyProfileListDefaults') THEN
    ALTER TABLE "AgencyProfiles" ALTER COLUMN "OperatingRegions" DROP NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324114650_EnsureAgencyProfileListDefaults') THEN
    ALTER TABLE "AgencyProfiles" ALTER COLUMN "Languages" DROP NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260324114650_EnsureAgencyProfileListDefaults') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260324114650_EnsureAgencyProfileListDefaults', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
    CREATE TABLE "EventCategories" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Icon" text,
        "IsActive" boolean NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        CONSTRAINT "PK_EventCategories" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
    CREATE INDEX "IX_EventCategoryFields_CategoryId" ON "EventCategoryFields" ("CategoryId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
    CREATE INDEX "IX_EventFieldValues_EventId" ON "EventFieldValues" ("EventId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
    CREATE INDEX "IX_EventFieldValues_FieldId" ON "EventFieldValues" ("FieldId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
    CREATE UNIQUE INDEX "IX_EventOrganizerProfiles_UserId" ON "EventOrganizerProfiles" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
    CREATE INDEX "IX_Events_CategoryId" ON "Events" ("CategoryId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
    CREATE INDEX "IX_Events_OrganizerProfileId" ON "Events" ("OrganizerProfileId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325073951_AddEventSystem') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260325073951_AddEventSystem', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    ALTER TABLE "EventOrganizerProfiles" RENAME COLUMN "TwitterUrl" TO "YouTubeLink";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    ALTER TABLE "EventOrganizerProfiles" RENAME COLUMN "InstagramUrl" TO "TwitterLink";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    ALTER TABLE "EventOrganizerProfiles" RENAME COLUMN "FacebookUrl" TO "TikTokLink";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    ALTER TABLE "EventOrganizerProfiles" ADD "FacebookLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    ALTER TABLE "EventOrganizerProfiles" ADD "InstagramLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    ALTER TABLE "EventOrganizerProfiles" ADD "Languages" text[];
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    ALTER TABLE "EventOrganizerProfiles" ADD "LinkedinLink" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    ALTER TABLE "EventOrganizerProfiles" ADD "OperatingAreas" text[];
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    ALTER TABLE "EventOrganizerProfiles" ADD "Specialties" text[];
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325093015_ExpandOrganizerProfile') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260325093015_ExpandOrganizerProfile', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325101035_FixOrganizerRoles') THEN
    UPDATE "Users" SET "Role" = 7 WHERE "Role" = 6 AND EXISTS (SELECT 1 FROM "EventOrganizerProfiles" WHERE "UserId" = "Users"."Id");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325101035_FixOrganizerRoles') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260325101035_FixOrganizerRoles', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325115103_AddEventEngagement') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325115103_AddEventEngagement') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325115103_AddEventEngagement') THEN
    CREATE INDEX "IX_EventLikes_EventId" ON "EventLikes" ("EventId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325115103_AddEventEngagement') THEN
    CREATE UNIQUE INDEX "IX_EventLikes_UserId_EventId" ON "EventLikes" ("UserId", "EventId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325115103_AddEventEngagement') THEN
    CREATE INDEX "IX_EventReviews_EventId" ON "EventReviews" ("EventId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325115103_AddEventEngagement') THEN
    CREATE INDEX "IX_EventReviews_UserId" ON "EventReviews" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260325115103_AddEventEngagement') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260325115103_AddEventEngagement', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326065609_AddTransportProvider') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326065609_AddTransportProvider') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326065609_AddTransportProvider') THEN
    CREATE UNIQUE INDEX "IX_TransportProfiles_UserId" ON "TransportProfiles" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326065609_AddTransportProvider') THEN
    CREATE INDEX "IX_Vehicles_TransportProfileId" ON "Vehicles" ("TransportProfileId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326065609_AddTransportProvider') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260326065609_AddTransportProvider', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326073318_AddVehicleEngagement') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326073318_AddVehicleEngagement') THEN
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
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326073318_AddVehicleEngagement') THEN
    CREATE UNIQUE INDEX "IX_VehicleLikes_UserId_VehicleId" ON "VehicleLikes" ("UserId", "VehicleId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326073318_AddVehicleEngagement') THEN
    CREATE INDEX "IX_VehicleLikes_VehicleId" ON "VehicleLikes" ("VehicleId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326073318_AddVehicleEngagement') THEN
    CREATE INDEX "IX_VehicleReviews_UserId" ON "VehicleReviews" ("UserId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326073318_AddVehicleEngagement') THEN
    CREATE INDEX "IX_VehicleReviews_VehicleId" ON "VehicleReviews" ("VehicleId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326073318_AddVehicleEngagement') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260326073318_AddVehicleEngagement', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326084943_AddVehicleAvailability') THEN
    ALTER TABLE "Vehicles" ADD "IsAvailable" boolean NOT NULL DEFAULT FALSE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326084943_AddVehicleAvailability') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260326084943_AddVehicleAvailability', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326090058_AddVehicleDriverIncluded') THEN
    ALTER TABLE "Vehicles" ADD "DriverIncluded" boolean NOT NULL DEFAULT FALSE;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260326090058_AddVehicleDriverIncluded') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260326090058_AddVehicleDriverIncluded', '9.0.0');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260329142623_AddRegistrationDocUrlToAgencyProfile') THEN
    ALTER TABLE "AgencyProfiles" ADD "RegistrationDocUrl" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260329142623_AddRegistrationDocUrlToAgencyProfile') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260329142623_AddRegistrationDocUrlToAgencyProfile', '9.0.0');
    END IF;
END $EF$;
COMMIT;

