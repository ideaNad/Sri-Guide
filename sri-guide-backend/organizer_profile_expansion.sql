-- Update EventOrganizerProfiles table to include social links and tag lists
ALTER TABLE "EventOrganizerProfiles" RENAME COLUMN "FacebookUrl" TO "FacebookLink";
ALTER TABLE "EventOrganizerProfiles" RENAME COLUMN "InstagramUrl" TO "InstagramLink";
ALTER TABLE "EventOrganizerProfiles" RENAME COLUMN "TwitterUrl" TO "TwitterLink";

ALTER TABLE "EventOrganizerProfiles" ADD COLUMN IF NOT EXISTS "TikTokLink" TEXT;
ALTER TABLE "EventOrganizerProfiles" ADD COLUMN IF NOT EXISTS "YouTubeLink" TEXT;
ALTER TABLE "EventOrganizerProfiles" ADD COLUMN IF NOT EXISTS "LinkedinLink" TEXT;

ALTER TABLE "EventOrganizerProfiles" ADD COLUMN IF NOT EXISTS "Languages" TEXT[];
ALTER TABLE "EventOrganizerProfiles" ADD COLUMN IF NOT EXISTS "Specialties" TEXT[];
ALTER TABLE "EventOrganizerProfiles" ADD COLUMN IF NOT EXISTS "OperatingAreas" TEXT[];
