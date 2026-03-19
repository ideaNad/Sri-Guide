-- Seed data for Bookings, Trips, and Reviews to make the dashboard look real (PostgreSQL version)

DO $$
DECLARE
    v_GuideId UUID := 'e4438bcb-4233-4c4a-981f-49f955d12f45';
    v_CustomerId UUID := '95089e2c-a353-4424-b94c-e1aba8a8799c';
    v_Trip1Id UUID := gen_random_uuid();
    v_Trip2Id UUID := gen_random_uuid();
BEGIN
    -- 1. Insert Bookings
    -- Status: 3=Completed, 1=Confirmed
    INSERT INTO "Bookings" ("Id", "GuideId", "CustomerId", "BookingDate", "Status", "TotalAmount", "Notes", "CreatedAt")
    VALUES 
    (gen_random_uuid(), v_GuideId, v_CustomerId, NOW(), 3, 120.00, 'South Coast Day Tour', NOW()),
    (gen_random_uuid(), v_GuideId, v_CustomerId, NOW() - INTERVAL '5 days', 3, 85.00, 'Ancient Ruins Hike', NOW()),
    (gen_random_uuid(), v_GuideId, v_CustomerId, NOW() + INTERVAL '2 days', 1, 95.00, 'Waiting for confirmation', NOW());

    -- 2. Insert Trips (Adventures)
    INSERT INTO "Trips" ("Id", "GuideId", "Title", "Description", "Location", "Date", "CreatedAt")
    VALUES 
    (v_Trip1Id, v_GuideId, 'Sunset at Sigiriya', 'Witnessed the most beautiful sunset from the summit. The colors were magical.', 'Sigiriya', NOW() - INTERVAL '10 days', NOW()),
    (v_Trip2Id, v_GuideId, 'Wildlife Safari in Yala', 'Spotted a leopard today! Yala never disappoints.', 'Yala National Park', NOW() - INTERVAL '2 days', NOW());

    -- 3. Insert Trip Images
    INSERT INTO "TripImages" ("Id", "TripId", "ImageUrl", "Caption", "CreatedAt")
    VALUES 
    (gen_random_uuid(), v_Trip1Id, 'https://images.unsplash.com/photo-1588598133416-2da21976a210?q=80&w=800', 'The view from the top', NOW()),
    (gen_random_uuid(), v_Trip2Id, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800', 'Close encounter with nature', NOW());

    -- 4. Insert Reviews
    INSERT INTO "Reviews" ("Id", "UserId", "TargetId", "TargetType", "Rating", "Comment", "CreatedAt")
    VALUES 
    (gen_random_uuid(), v_CustomerId, v_GuideId, 'Guide', 5, 'Sunil was an amazing guide! Very knowledgeable.', NOW()),
    (gen_random_uuid(), v_CustomerId, v_GuideId, 'Guide', 4, 'Great experience, highly recommended.', NOW() - INTERVAL '3 days');

END $$;
