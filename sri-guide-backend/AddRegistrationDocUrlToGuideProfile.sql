-- Migration: AddRegistrationDocUrlToGuideProfile
-- Generated: 2026-04-01

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260401001523_AddRegistrationDocUrlToGuideProfile') THEN
    ALTER TABLE "GuideProfiles" ADD "RegistrationDocUrl" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260401001523_AddRegistrationDocUrlToGuideProfile') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260401001523_AddRegistrationDocUrlToGuideProfile', '9.0.0');
    END IF;
END $EF$;

COMMIT;
