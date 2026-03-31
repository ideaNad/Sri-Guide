START TRANSACTION;
ALTER TABLE "Tours" ADD "ParticipantCount" text;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260330211526_AddParticipantCountToTour', '9.0.0');

COMMIT;

