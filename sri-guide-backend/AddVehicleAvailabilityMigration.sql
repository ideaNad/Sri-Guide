-- Add IsAvailable column to Vehicles table
START TRANSACTION;

ALTER TABLE "Vehicles" ADD "IsAvailable" boolean NOT NULL DEFAULT FALSE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260326084943_AddVehicleAvailability', '9.0.0');

COMMIT;
