-- Migration: AddRegistrationDocUrlToAgencyProfile
-- Generated: 2026-03-29

START TRANSACTION;

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
