-- SriGuide Quest Seeding
-- Categories: 0: Nature, 1: Adventure, 2: Culture, 3: Food, 4: Ocean, 5: HiddenGems, 6: Extreme
-- Difficulties: 0: Easy, 1: Medium, 2: Hard, 3: Legendary

-- 🟢 EASY QUESTS (100 XP)
INSERT INTO "Quests" ("Id", "Name", "Description", "Latitude", "Longitude", "Category", "Difficulty", "RewardXP", "PhotoRequirement", "CreatedAt", "IsActive", "ProximityRadiusInMeters", "LocationName")
VALUES 
(gen_random_uuid(), 'Kottu Percussionist', 'Record the rhythmic chopping of kottu in Colombo.', 6.9271, 79.8612, 3, 0, 100, 'Video of kottu preparation', NOW(), true, 5000, 'Colombo Street Food'),
(gen_random_uuid(), 'Tuk-Tuk Selfie', 'Snap a selfie inside a decorated Sri Lankan Tuk-Tuk.', 6.9271, 79.8612, 1, 0, 100, 'Selfie in a Tuk-Tuk', NOW(), true, 500000, 'Anywhere in Sri Lanka'),
(gen_random_uuid(), 'Golden Hour at Galle', 'Capture the sunset from the Galle Fort ramparts.', 6.0331, 80.2147, 2, 0, 100, 'Sunset from Galle Fort', NOW(), true, 1000, 'Galle Fort'),
(gen_random_uuid(), 'The King''s Coconut', 'Photo of you drinking a fresh King Coconut (Thambili).', 6.9271, 79.8612, 3, 0, 100, 'Drinking Thambili', NOW(), true, 500000, 'Anywhere in Sri Lanka'),
(gen_random_uuid(), 'Lipton''s Seat Salute', 'Enjoy the view from Lipton’s Seat, Haputale.', 6.7842, 80.9912, 0, 0, 100, 'Panorama from Lipton Seat', NOW(), true, 1000, 'Lipton''s Seat'),
(gen_random_uuid(), 'Train Wave', 'Wave at someone from the Kandy-Ella train.', 6.8778, 80.7681, 1, 0, 100, 'Waving from the train', NOW(), true, 10000, 'Train Route'),
(gen_random_uuid(), 'Hopper Master', 'Capture a perfectly shaped Egg Hopper.', 6.9271, 79.8612, 3, 0, 100, 'Photo of an Egg Hopper', NOW(), true, 500000, 'Any Local Restaurant'),
(gen_random_uuid(), 'Statue Silence', 'Respectful photo of Bahirawakanda Vihara Buddha.', 7.2941, 80.6273, 2, 0, 100, 'Bahirawakanda Buddha', NOW(), true, 1000, 'Kandy'),
(gen_random_uuid(), 'Beach Paw Prints', 'Follow dog tracks on Mirissa beach.', 5.9482, 80.4716, 4, 0, 100, 'Dog prints by the surf', NOW(), true, 1000, 'Mirissa Beach'),
(gen_random_uuid(), 'Tropical Rain Dance', 'Photo of a tropical rain shower from safety.', 6.9271, 79.8612, 0, 0, 100, 'Falling rain', NOW(), true, 500000, 'Anywhere in Sri Lanka'),
(gen_random_uuid(), 'Kalutara Bodhiya Peace', 'Visit the sacred Kalutara Bodhiya and its hollow stupa.', 6.5866, 79.9606, 2, 0, 100, 'The white stupa of Kalutara', NOW(), true, 1000, 'Kalutara');

-- 🟡 MEDIUM QUESTS (250 XP)
INSERT INTO "Quests" ("Id", "Name", "Description", "Latitude", "Longitude", "Category", "Difficulty", "RewardXP", "PhotoRequirement", "CreatedAt", "IsActive", "ProximityRadiusInMeters", "LocationName")
VALUES 
(gen_random_uuid(), 'Sigiriya Stairmaster', 'Reach the Lion''s Paw at Sigiriya.', 7.9573, 80.7573, 2, 1, 250, 'Lion''s Paw at Sigiriya', NOW(), true, 300, 'Sigiriya Lion Rock'),
(gen_random_uuid(), 'Nine Arches Timing', 'Capture a train passing over the Nine Arches Bridge.', 6.8761, 81.0612, 1, 1, 250, 'Train on Nine Arches', NOW(), true, 400, 'Ella'),
(gen_random_uuid(), 'Spicy Tongue Challenge', 'Eat a "Nai Miris" (Cobra Chili) dish.', 6.9271, 79.8612, 3, 1, 250, 'Photo of Nai Miris dish', NOW(), true, 1000, 'Any Spicy Eatery'),
(gen_random_uuid(), 'Little Adam’s Peak Sunrise', 'Capture the first light from the summit.', 6.8660, 81.0600, 0, 1, 250, 'Sunrise at Little Adam''s Peak', NOW(), true, 300, 'Ella'),
(gen_random_uuid(), 'Stilt Fisherman''s Balance', 'Photo of stilt fishermen in Weligama.', 5.9733, 80.4357, 4, 1, 250, 'Stilt Fishermen', NOW(), true, 500, 'Weligama/Ahangama'),
(gen_random_uuid(), 'Dambulla Cave Shadows', 'Interior atmosphere of Dambulla Cave Temple.', 7.8576, 80.6517, 2, 1, 250, 'Inside Dambulla Caves', NOW(), true, 300, 'Dambulla'),
(gen_random_uuid(), 'Waterberry Hunter', 'Photograph a wild "Dan" or "Era-Mudu" fruit tree.', 6.9271, 79.8612, 0, 1, 250, 'Wild fruit tree', NOW(), true, 10000, 'Central Province'),
(gen_random_uuid(), 'Turtle Guardian', 'Turtle release at a hatchery in Hikkaduwa.', 6.1362, 80.1042, 4, 1, 250, 'Turtle hatchlings', NOW(), true, 300, 'Hikkaduwa'),
(gen_random_uuid(), 'Tea Plucker’s Precision', 'Photo of "two leaves and a bud".', 6.9497, 80.7891, 0, 1, 250, 'Close-up of tea leaves', NOW(), true, 400, 'Nuwara Eliya'),
(gen_random_uuid(), 'Tuk-Tuk Navigator', 'Drive a Tuk-Tuk for the first time.', 6.9271, 79.8612, 1, 1, 250, 'You at the handle bars', NOW(), true, 1000, 'Any Tuk-Tuk Lesson'),
(gen_random_uuid(), 'Bopath Ella Mist', 'Feel the spray of the heart-shaped Bopath Ella falls.', 6.7900, 80.3600, 0, 1, 250, 'The Bopath Ella waterfall', NOW(), true, 500, 'Ratnapura');

-- 🔴 HARD QUESTS (600 XP)
INSERT INTO "Quests" ("Id", "Name", "Description", "Latitude", "Longitude", "Category", "Difficulty", "RewardXP", "PhotoRequirement", "CreatedAt", "IsActive", "ProximityRadiusInMeters", "LocationName")
VALUES 
(gen_random_uuid(), 'Adam''s Peak Night Owl', 'Summit Sri Pada (Adam''s Peak) for sunrise.', 6.8091, 80.4971, 6, 2, 600, 'Shadow of the Peak at sunrise', NOW(), true, 200, 'Sripada (Adam''s Peak)'),
(gen_random_uuid(), 'Elephant Whispering', 'Photograph a wild elephant in Habarana.', 8.0345, 80.7516, 0, 2, 600, 'Wild elephant photo', NOW(), true, 500, 'Habarana Safari'),
(gen_random_uuid(), 'Peacock Parade', 'A wild peacock with tail fully fanned.', 6.2575, 81.3323, 0, 2, 600, 'Fanning peacock', NOW(), true, 1000, 'Yala/Bundala'),
(gen_random_uuid(), 'Secret Waterfall Soak', 'Reach the top tier of Diyaluma Falls.', 6.7262, 81.0315, 5, 2, 600, 'Top pools of Diyaluma', NOW(), true, 300, 'Diyaluma Falls'),
(gen_random_uuid(), 'Ancient City Explorer', 'Visit 3 sites in Polonnaruwa.', 7.9403, 81.0003, 2, 2, 600, '3 different Polonnaruwa ruins', NOW(), true, 2000, 'Polonnaruwa'),
(gen_random_uuid(), 'Surfing the Point', 'Catch a wave at Arugam Bay Main Point.', 6.8407, 81.8347, 4, 2, 600, 'Action shot surfing', NOW(), true, 400, 'Arugam Bay'),
(gen_random_uuid(), 'Jungle Cabin Night', 'Spend a night in a remote jungle cabin.', 6.9271, 79.8612, 1, 2, 600, 'Inside a jungle cabin', NOW(), true, 10000, 'Sinharaja Region'),
(gen_random_uuid(), 'Knuckles Trekker', 'Complete the Manigala hike.', 7.4510, 80.7936, 6, 2, 600, 'View from Manigala peak', NOW(), true, 300, 'Knuckles Range'),
(gen_random_uuid(), 'Whale Tail', 'Capture a whale''s tail in Mirissa.', 5.9482, 80.4716, 4, 2, 600, 'Whale tail splash', NOW(), true, 5000, 'Mirissa Deep Sea'),
(gen_random_uuid(), 'Street Food Marathon', 'Eat 5 street food items at Aluth Kade.', 6.9388, 79.8541, 3, 2, 600, 'Collage of 5 food items', NOW(), true, 400, 'Aluth Kade, Colombo');

-- 🏆 LEGENDARY QUESTS (1500 XP)
INSERT INTO "Quests" ("Id", "Name", "Description", "Latitude", "Longitude", "Category", "Difficulty", "RewardXP", "PhotoRequirement", "CreatedAt", "IsActive", "ProximityRadiusInMeters", "LocationName", "RewardTitle")
VALUES 
(gen_random_uuid(), 'Leopard''s Gaze', 'Clear photo of a leopard in Yala.', 6.3686, 81.5168, 6, 3, 1500, 'A leopard in its habitat', NOW(), true, 1000, 'Yala Block 1', 'Leopard Lord'),
(gen_random_uuid(), 'Cloud Forest Ghost', 'Photograph a Slender Loris at night.', 7.0000, 80.7000, 0, 3, 1500, 'Slender Loris glowing eyes', NOW(), true, 5000, 'Central Cloud Forests', 'Ghost Tracker'),
(gen_random_uuid(), 'The Hidden Gem', 'Submit a location not on SriGuide.', 6.9271, 79.8612, 5, 3, 1500, 'Undiscovered spot', NOW(), true, 10000, 'Remote Sri Lanka', 'Seeker of Secrets'),
(gen_random_uuid(), 'Across the Island', 'Visit North and South points in one trip.', 9.8021, 80.2458, 6, 3, 1500, 'Point Pedro AND Dondra tokens', NOW(), true, 10000, 'Island Wide', 'The Great Voyager'),
(gen_random_uuid(), 'Monsoon Conqueror', 'Complete 5 hard quests during Monsoon.', 6.9271, 79.8612, 6, 3, 1500, 'Photo in heavy monsoon rain', NOW(), true, 10000, 'Zonal', 'Monsoon Monarch');
