-- Add DriverIncluded column to Vehicles table
START TRANSACTION;

ALTER TABLE "Vehicles" ADD "DriverIncluded" boolean NOT NULL DEFAULT FALSE;

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260326090058_AddVehicleDriverIncluded', '9.0.0');

COMMIT;
