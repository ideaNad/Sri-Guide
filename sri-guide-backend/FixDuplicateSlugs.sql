-- SQL script to fix duplicate slugs in the database
-- This script appends a numeric suffix to duplicates based on creation order

-- 1. Fix Users duplicates
WITH DuplicateUsers AS (
    SELECT "Id", "Slug", ROW_NUMBER() OVER(PARTITION BY "Slug" ORDER BY "CreatedAt" ASC) as row_num
    FROM "Users"
    WHERE "Slug" IS NOT NULL
)
UPDATE "Users"
SET "Slug" = "Users"."Slug" || '-' || (DuplicateUsers.row_num - 1)
FROM DuplicateUsers
WHERE "Users"."Id" = DuplicateUsers."Id" AND DuplicateUsers.row_num > 1;

-- 2. Fix Trips duplicates
WITH DuplicateTrips AS (
    SELECT "Id", "Slug", ROW_NUMBER() OVER(PARTITION BY "Slug" ORDER BY "CreatedAt" ASC) as row_num
    FROM "Trips"
    WHERE "Slug" IS NOT NULL
)
UPDATE "Trips"
SET "Slug" = "Trips"."Slug" || '-' || (DuplicateTrips.row_num - 1)
FROM DuplicateTrips
WHERE "Trips"."Id" = DuplicateTrips."Id" AND DuplicateTrips.row_num > 1;

-- 3. Fix Tours duplicates
WITH DuplicateTours AS (
    SELECT "Id", "Slug", ROW_NUMBER() OVER(PARTITION BY "Slug" ORDER BY "CreatedAt" ASC) as row_num
    FROM "Tours"
    WHERE "Slug" IS NOT NULL
)
UPDATE "Tours"
SET "Slug" = "Tours"."Slug" || '-' || (DuplicateTours.row_num - 1)
FROM DuplicateTours
WHERE "Tours"."Id" = DuplicateTours."Id" AND DuplicateTours.row_num > 1;

-- 4. Fix PopularPlaces duplicates
WITH DuplicatePlaces AS (
    SELECT "Id", "Slug", ROW_NUMBER() OVER(PARTITION BY "Id" ORDER BY "Id" ASC) as row_num -- PopularPlaces might not have CreatedAt, check ID
    FROM "PopularPlaces"
    WHERE "Slug" IS NOT NULL
)
UPDATE "PopularPlaces"
SET "Slug" = "PopularPlaces"."Slug" || '-' || (DuplicatePlaces.row_num - 1)
FROM DuplicatePlaces
WHERE "PopularPlaces"."Id" = DuplicatePlaces."Id" AND DuplicatePlaces.row_num > 1;

-- 5. Fix AgencyProfiles duplicates
WITH DuplicateAgencies AS (
    SELECT "Id", "Slug", ROW_NUMBER() OVER(PARTITION BY "Slug" ORDER BY "Id" ASC) as row_num
    FROM "AgencyProfiles"
    WHERE "Slug" IS NOT NULL
)
UPDATE "AgencyProfiles"
SET "Slug" = "AgencyProfiles"."Slug" || '-' || (DuplicateAgencies.row_num - 1)
FROM DuplicateAgencies
WHERE "AgencyProfiles"."Id" = DuplicateAgencies."Id" AND DuplicateAgencies.row_num > 1;
