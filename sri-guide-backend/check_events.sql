SELECT "Title", "CoverImage" FROM "Events";

UPDATE "Users" 
SET "Role" = 7 
WHERE "Role" = 6 
AND EXISTS (
    SELECT 1 FROM "EventOrganizerProfiles" 
    WHERE "UserId" = "Users"."Id"
);
