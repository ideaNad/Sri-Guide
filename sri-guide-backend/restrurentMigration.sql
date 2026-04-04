START TRANSACTION;
CREATE TABLE "FoodCategories" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "ImageUrl" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_FoodCategories" PRIMARY KEY ("Id")
);

CREATE TABLE "RestaurantProfiles" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Name" text NOT NULL,
    "Slug" text,
    "Description" text,
    "Phone" text,
    "WhatsApp" text,
    "Email" text,
    "CoverImage" text,
    "Logo" text,
    "Address" text,
    "District" text,
    "Province" text,
    "Latitude" double precision,
    "Longitude" double precision,
    "MapUrl" text,
    "OpeningTime" text,
    "ClosingTime" text,
    "PriceRange" text,
    "CuisineTypes" text[],
    "IsVerified" boolean NOT NULL,
    "VerificationStatus" integer NOT NULL,
    "IsActive" boolean NOT NULL,
    "LanguagesSpoken" text[],
    "MenuLanguages" text[],
    "DietaryOptions" text[],
    "Facilities" text[],
    "PaymentMethods" text[],
    "FamilyFriendly" boolean NOT NULL,
    "RomanticSetting" boolean NOT NULL,
    "GroupFriendly" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_RestaurantProfiles" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RestaurantProfiles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "Menus" (
    "Id" uuid NOT NULL,
    "RestaurantProfileId" uuid NOT NULL,
    "Name" text NOT NULL,
    "Description" text,
    "IsActive" boolean NOT NULL,
    "Order" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_Menus" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Menus_RestaurantProfiles_RestaurantProfileId" FOREIGN KEY ("RestaurantProfileId") REFERENCES "RestaurantProfiles" ("Id") ON DELETE CASCADE
);

CREATE TABLE "RestaurantEvents" (
    "Id" uuid NOT NULL,
    "RestaurantProfileId" uuid NOT NULL,
    "Title" text NOT NULL,
    "Description" text,
    "EventType" text,
    "StartDateTime" timestamp with time zone,
    "EndDateTime" timestamp with time zone,
    "Image" text,
    "IsRecurring" boolean NOT NULL,
    "TicketRequired" boolean NOT NULL,
    "TicketPrice" double precision,
    "Currency" text,
    "PerformerName" text,
    "MusicGenre" text,
    "DressCode" text,
    "ReservationRequired" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_RestaurantEvents" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RestaurantEvents_RestaurantProfiles_RestaurantProfileId" FOREIGN KEY ("RestaurantProfileId") REFERENCES "RestaurantProfiles" ("Id") ON DELETE CASCADE
);

CREATE TABLE "RestaurantLikes" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "RestaurantProfileId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_RestaurantLikes" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RestaurantLikes_RestaurantProfiles_RestaurantProfileId" FOREIGN KEY ("RestaurantProfileId") REFERENCES "RestaurantProfiles" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_RestaurantLikes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "RestaurantReviews" (
    "Id" uuid NOT NULL,
    "RestaurantProfileId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Rating" integer NOT NULL,
    "Comment" text,
    "Photos" text[],
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_RestaurantReviews" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RestaurantReviews_RestaurantProfiles_RestaurantProfileId" FOREIGN KEY ("RestaurantProfileId") REFERENCES "RestaurantProfiles" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_RestaurantReviews_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE "MenuItems" (
    "Id" uuid NOT NULL,
    "MenuId" uuid NOT NULL,
    "FoodCategoryId" uuid,
    "Name" text NOT NULL,
    "Description" text,
    "Price" double precision,
    "Currency" text,
    "Image" text,
    "IsAvailable" boolean NOT NULL,
    "IsFeatured" boolean NOT NULL,
    "PrepTimeMinutes" integer,
    "SpiceLevel" text,
    "PortionSize" text,
    "Calories" integer,
    "IngredientsList" text,
    "AllergenInfo" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    CONSTRAINT "PK_MenuItems" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_MenuItems_FoodCategories_FoodCategoryId" FOREIGN KEY ("FoodCategoryId") REFERENCES "FoodCategories" ("Id") ON DELETE SET NULL,
    CONSTRAINT "FK_MenuItems_Menus_MenuId" FOREIGN KEY ("MenuId") REFERENCES "Menus" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_MenuItems_FoodCategoryId" ON "MenuItems" ("FoodCategoryId");

CREATE INDEX "IX_MenuItems_MenuId" ON "MenuItems" ("MenuId");

CREATE INDEX "IX_Menus_RestaurantProfileId" ON "Menus" ("RestaurantProfileId");

CREATE INDEX "IX_RestaurantEvents_RestaurantProfileId" ON "RestaurantEvents" ("RestaurantProfileId");

CREATE INDEX "IX_RestaurantLikes_RestaurantProfileId" ON "RestaurantLikes" ("RestaurantProfileId");

CREATE UNIQUE INDEX "IX_RestaurantLikes_UserId_RestaurantProfileId" ON "RestaurantLikes" ("UserId", "RestaurantProfileId");

CREATE UNIQUE INDEX "IX_RestaurantProfiles_Slug" ON "RestaurantProfiles" ("Slug");

CREATE UNIQUE INDEX "IX_RestaurantProfiles_UserId" ON "RestaurantProfiles" ("UserId");

CREATE INDEX "IX_RestaurantReviews_RestaurantProfileId" ON "RestaurantReviews" ("RestaurantProfileId");

CREATE INDEX "IX_RestaurantReviews_UserId" ON "RestaurantReviews" ("UserId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260404085230_AddRestaurantModule', '9.0.0');

COMMIT;
