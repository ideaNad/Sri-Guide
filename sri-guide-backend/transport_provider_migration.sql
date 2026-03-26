START TRANSACTION;
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

COMMIT;

