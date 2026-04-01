START TRANSACTION;
ALTER TABLE "AgencyProfiles" ADD "AgencyProfileImageUrl" text;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260401131928_AddAgencyProfileImageUrl', '9.0.0');

COMMIT;

