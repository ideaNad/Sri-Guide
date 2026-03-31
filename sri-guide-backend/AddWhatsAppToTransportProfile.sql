-- Migration: AddWhatsAppToTransportProfile
-- Generated: 2026-03-31

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260331174614_AddWhatsAppToTransportProfile') THEN
    ALTER TABLE "TransportProfiles" ADD "WhatsAppNumber" text;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260331174614_AddWhatsAppToTransportProfile') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260331174614_AddWhatsAppToTransportProfile', '9.0.0');
    END IF;
END $EF$;

COMMIT;
