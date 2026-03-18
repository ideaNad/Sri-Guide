You are a senior full-stack architect and developer.

Project: sriguide.lk — A comprehensive tourism marketplace for Sri Lanka.

⚠️ IMPORTANT RULES:

DO NOT break existing Next.js styles or UI

ONLY extend and improve current frontend

Maintain clean, scalable architecture

Use best practices for performance, security, and UX

Keep APIs well-structured and documented

🎯 CORE PRODUCT GOAL

Build a full tourism ecosystem platform where:

Tourists can browse WITHOUT login

Login is REQUIRED for:

Booking

Contacting providers

Saving plans

System connects:

Tour guides

Vehicle owners

Hotels

Restaurants

Attractions

Main feature:
👉 Smart Trip Planner (manual + extendable for AI)

🔐 AUTH & SECURITY (CRITICAL)

Implement:

JWT authentication (access + refresh tokens)

Role-based access control (RBAC)

Roles:

tourist

guide

vehicle_owner

hotel_owner

restaurant_owner

admin

Rules:

Public users can view:

guides

vehicles

hotels

plans

ONLY logged-in users can:

book

contact providers

save itineraries

leave reviews

Security:

Password hashing (bcrypt or Argon2)

Rate limiting on auth endpoints

Input validation (FluentValidation in .NET)

Secure HTTP-only cookies (if used)

Protect APIs with authorization middleware

🧩 BACKEND (.NET ASP.NET CORE)

Architecture:

Clean Architecture

Controllers + Services + Repositories

Entity Framework Core (PostgreSQL)

Modules:

Auth

Users

Guides

Vehicles

Hotels

Restaurants

Tour Plans

Itinerary Planner

Bookings

Payments (structure only)

Reviews

📊 DATABASE (PostgreSQL)

Core Entities:

Users
Guides
Vehicles
Hotels
Restaurants
TourPlans
Itineraries
ItineraryDays
ItineraryItems
Bookings
Payments
Reviews
Images

Requirements:

Use UUIDs

Proper foreign keys

Index for search fields

JSONB for flexible data (itinerary, galleries)

🧠 ITINERARY PLANNER (CORE FEATURE)

Implement:

Tourist can:

Create itinerary

Add multiple days

Add items per day:

guide

vehicle

hotel

place

restaurant

Features:

Drag & drop ready structure (frontend)

Real-time cost calculation

Store cost per item

Total trip cost auto-calculated

Guide can:

Create predefined tour plans

Add:

itinerary

images

pricing per day or per place

🏨 PROVIDER FEATURES

Guides:

Profile (bio, languages, license)

Daily + hourly rates

Create tour plans

Upload images

Manage bookings

Hotels:

Add rooms / price

Upload images

Availability (basic)

Receive bookings

Vehicle Owners:

Add vehicles

Pricing (hour/day)

Upload images

Restaurants:

Add listing

Images

Basic details

📅 BOOKING SYSTEM

Flow:

User selects itinerary OR plan

Clicks book

Backend creates booking

Status:

pending

confirmed

cancelled

Include:

price breakdown

dates

number of people

⭐ REVIEW SYSTEM

Only logged-in users can review

Only after booking (optional validation)

Rating + comment

Attach to:

guide

hotel

vehicle

restaurant

🎨 FRONTEND (NEXT.JS)

IMPORTANT:

KEEP EXISTING UI/STYLES

DO NOT rewrite design system

Extend with:

Pages:

/search

/guide/[id]

/vehicle/[id]

/hotel/[id]

/plan/[id]

/itinerary (planner)

/dashboard (role-based)

Features:

Public browsing (no login)

Login modal when action required

Planner UI (day-by-day layout)

Cost breakdown sidebar

Image galleries

Rating UI

⚡ PERFORMANCE

Use SSR/ISR for SEO pages

Lazy load images

Optimize API calls

Cache frequently accessed data

📦 API DESIGN

Follow REST:

GET /guides
GET /guides/{id}
POST /guides
GET /plans
POST /itineraries
GET /itineraries/{id}
POST /bookings
POST /auth/login
POST /auth/register

🧪 OUTPUT EXPECTATION

Generate:

Backend project structure

Key models (C#)

DbContext

Sample controllers (Auth, Booking, Planner)

API contracts (DTOs)

Frontend integration strategy (Next.js)

Missing gaps & improvements

Focus on:

scalability

clean code

real-world production readiness

🎯 FINAL GOAL

Deliver a system where:

Users can explore without login

Must login to interact

Can build full trip plans

Can book entire trips

All providers are connected in one ecosystem

END

🧠 EXTRA ARCHITECTURE IMPROVEMENTS (VERY IMPORTANT)
1. Public vs Private System (You asked this specifically)

✅ WITHOUT LOGIN:

Browse guides

View hotels

View vehicles

View plans

See pricing

Read reviews

🔒 WITH LOGIN:

Book

Contact

Save itinerary

Review

Dashboard

👉 UX tip:
Show “Login to continue” modal, not redirect immediately.

2. Planner Ownership (Power feature)

You mentioned:

“custom planner for turist also guides”

💡 Upgrade:

Tourist → create private itineraries

Guide → create sellable plans

Tourist can:

copy guide plan

customize it

3. Pricing Engine (VERY IMPORTANT)

Each item contributes to total:

Item	Cost Source
Guide	daily/hourly
Vehicle	per day
Hotel	per night
Restaurant	optional
Attractions	fixed/manual

👉 Backend must calculate:

total_cost = sum(all items)
4. Image System

Use:

S3 / Cloudinary

Store:

profile images

galleries

location images

5. Future Upgrade (Plan ahead)

AI planner

Chat between tourist & guide

Real-time availability

Mobile app

⚠️ Common Mistakes (Avoid these)

❌ Don’t force login for browsing

❌ Don’t mix planner + booking logic tightly

❌ Don’t store prices only in frontend

❌ Don’t skip provider verification

❌ Don’t ignore performance (images!)