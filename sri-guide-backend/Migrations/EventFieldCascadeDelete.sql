-- SQL Migration: Update EventFieldValues to use CASCADE delete for Category Fields
-- Goal: Automatically clean up field values when a custom field is removed from a category.

-- 1. Drop the existing restrictive foreign key
ALTER TABLE "EventFieldValues" 
DROP CONSTRAINT IF EXISTS "FK_EventFieldValues_EventCategoryFields_FieldId";

-- 2. Re-add the foreign key with CASCADE delete behavior
ALTER TABLE "EventFieldValues" 
ADD CONSTRAINT "FK_EventFieldValues_EventCategoryFields_FieldId" 
FOREIGN KEY ("FieldId") 
REFERENCES "EventCategoryFields" ("Id") 
ON DELETE CASCADE;

-- Optional: Verify the change
-- SELECT conname, confdeltype 
-- FROM pg_constraint 
-- WHERE conname = 'FK_EventFieldValues_EventCategoryFields_FieldId';
-- Note: 'c' in confdeltype means CASCADE.
