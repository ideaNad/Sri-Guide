-- Migration: AddVehicleEngagement
-- Date: 2026-03-26

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
