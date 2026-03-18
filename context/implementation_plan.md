# SriGuide.lk — Full Implementation Plan

> Exhaustive phase-wise plan. Each phase lists **Database**, **Backend (.NET)**, and **Frontend (Next.js)** tasks.
> Includes premium UX/animation specs, extended tourism ecosystem features, and **VPS deployment** strategy.
> **Hosting**: Self-managed VPS (no AWS/Azure/cloud). Images stored on **local filesystem** (`/uploads`).

---

## Phase 1 — Foundation, Auth & Premium UI Shell

### 1.1 Infrastructure Setup

| Layer | Tasks |
|:---|:---|
| **DB** | Install PostgreSQL. Create `sriguide_db`. Enable `uuid-ossp`.<br/>**Connection String**: `Host=localhost;Port=5432;Database=sriguide_db;Username=postgres;Password=admin` |
| **BE** | Create .NET Clean Architecture solution:<br/>• `SriGuide.Domain` — Entities, Enums, Value Objects<br/>• `SriGuide.Application` — Interfaces, DTOs, Validators (FluentValidation), Handlers (MediatR)<br/>• `SriGuide.Infrastructure` — EF Core DbContext, Repos, External Services<br/>• `SriGuide.API` — Controllers, Middleware, Program.cs<br/>NuGet: `EFCore.Npgsql`, `MediatR`, `FluentValidation`, `AutoMapper`. |
| **FE** | Install: `@tanstack/react-query`, `zustand`, `axios`, `framer-motion` (already installed), `@dnd-kit/core`.<br/>Create `lib/apiClient.ts`, `providers/QueryProvider.tsx`. |

### 1.2 User Registration & Login

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `001_CreateUsersAndRoles`**:<br/>• `Users` — Id (UUID PK), FullName, Email (unique), PasswordHash, PhoneNumber, ProfileImageUrl, Role (enum), IsVerified, CreatedAt, UpdatedAt.<br/>• `RefreshTokens` — Id, Token, ExpiresAt, UserId (FK).<br/>• Seed roles: `tourist`, `guide`, `vehicle_owner`, `hotel_owner`, `restaurant_owner`, `travel_agency` 🆕, `event_planner` 🆕, `admin`. |
| **BE** | • `POST /api/auth/register` — FluentValidation, Argon2 hashing, return JWT pair.<br/>• `POST /api/auth/login` — Access (15min) + Refresh (7d, HTTP-only cookie).<br/>• `POST /api/auth/refresh`, `POST /api/auth/logout`.<br/>• Rate limiting, global error middleware, CORS config. |
| **FE** | • `AuthModal.tsx` — Tabbed Login/Sign Up with glassmorphism card overlay.<br/>• `useAuth` hook — session + auto-refresh.<br/>• Trigger modal on Book/Save/Contact/Review (never hard redirect). |

### 1.3 Premium UI Shell & Animation System

| Layer | Tasks |
|:---|:---|
| **FE** | **Image Optimization**: Refactor all `<img>` → `next/image` with blur placeholders.<br/><br/>**Animation System** (Framer Motion — keep existing design system):<br/>• **Page Transitions**: Fade + slide-up on route change using `AnimatePresence`.<br/>• **Scroll Reveals**: Staggered fade-in for card grids (`whileInView`, `staggerChildren: 0.08`).<br/>• **Hero Parallax**: Subtle parallax scroll on hero background images (`useScroll` + `useTransform`).<br/>• **Card Hover**: `scale(1.03)` + shadow lift + image zoom (`group-hover:scale-110`).<br/>• **Button Micro-interactions**: `whileTap={{ scale: 0.97 }}`, ripple effect on click.<br/>• **Number Counters**: Animated count-up for stats (10k+ travelers, etc.) using `useInView` trigger.<br/>• **Skeleton Shimmer**: Gradient pulse animation for loading states.<br/>• **Toast Notifications**: Slide-in from top-right with auto-dismiss.<br/>• **Modal Entrance**: Scale from 0.95 + fade backdrop.<br/><br/>**Polish**:<br/>• Active link underline animation in Navbar.<br/>• Consistent 8px spacing grid system.<br/>• Typography scale: `text-xs` → `text-6xl` with proper `leading-` and `tracking-`.<br/>• Focus ring styles for accessibility (`ring-2 ring-primary/50`).<br/>• Smooth `scroll-behavior: smooth` sitewide.<br/>• Custom scrollbar styling (thin, themed). |

---

## Phase 2 — Provider Ecosystem & Discovery

### 2.1 Guide Profiles

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `002_CreateGuides`**:<br/>• `Guides` — Id, UserId (FK), Bio, Languages (text[]), LicenseNumber, Specialty, DailyRate, HourlyRate, IsVerified, VerificationStatus (pending/approved/rejected), AverageRating, ReviewCount, AgencyId (FK, nullable). |
| **BE** | • `GET /api/guides` (paginated, filtered), `GET /api/guides/{id}`, `POST /api/guides`.<br/>• ⚠️ Guides can manage **profile only** — they **cannot** create Tour Plans.<br/>• ⚠️ `GET /api/guides/{id}` — **contact details (phone, email, WhatsApp) are hidden for anonymous users**. Backend checks auth token: if authenticated → return full response; if anonymous → return `contactDetails: null`. Same pattern for all provider detail endpoints. |
| **FE** | • `/guide/[id]` — animated profile hero, bio, gallery, reviews.<br/>• "Add to Plan" floating button. Show "Upgrade to Agency" CTA if guide tries to create plans. |

### 2.1b 🆕 Travel Agency System

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `002b_CreateAgencies`**:<br/>• `AgencyProfiles` — Id, UserId (FK), **CompanyName**, **CompanyEmail**, **RegistrationNumber**, **AgencyPhoneNumber**, **WhatsAppNumber**, Description, VerificationStatus (pending/approved/rejected), VerificationDocuments (JSONB — business registration doc, license doc URLs), VerifiedBadge (bool), CreatedAt.<br/>• `AgencyGuides` — Id, AgencyId (FK), GuideId (FK), Status (invited/accepted/removed), InvitedAt, AcceptedAt.<br/>• `TourPlans` — Id, AgencyId (FK) 🔄 (changed from GuideId), Title, Description, CoverImageUrl, TotalPrice, DurationDays, IsPublished, AssignedGuideId (FK, nullable). |
| **BE** | • `POST /api/agency/apply` — guide submits: CompanyName, CompanyEmail, RegistrationNumber, AgencyPhoneNumber, WhatsAppNumber + document uploads (business registration, license). FluentValidation: email format, phone format, required fields.<br/>• `GET /api/agency/me` — get agency profile + verification status.<br/>• `POST /api/agency/invite-guide`, `POST /api/agency/accept-invite`, `GET /api/agency/guides`.<br/>• ⚠️ Tour Plan CRUD restricted to `travel_agency` role only.<br/>• `POST /api/plans` — create tour plan (travel_agency only).<br/>• `PUT /api/plans/{id}/assign-guide` — assign a guide to a plan. |
| **FE** | • `/agency/upgrade` — multi-step form:<br/>  Step 1: Company Name, Registration Number<br/>  Step 2: Company Email, Phone Number, WhatsApp Number<br/>  Step 3: Upload documents (business registration + license)<br/>  Step 4: Review & Submit<br/>• Agency dashboard: My Guides, My Tour Plans, Received Bookings, Earnings.<br/>• "Invite Guide" button with search + invite flow.<br/>• Guide sees pending invitations in their dashboard. |

### 2.1c 🆕 Verification & Badge System

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `002c_CreateVerifications`**:<br/>• `Verifications` — Id, UserId (FK), EntityType (guide/agency/event_planner), Documents (JSONB), Status (pending/approved/rejected), ReviewedBy (admin UserId), ReviewedAt, Notes, CreatedAt. |
| **BE** | • `POST /api/verification/submit` — user uploads verification documents.<br/>• `GET /api/admin/verifications` — admin lists pending verifications.<br/>• `POST /api/admin/verify` — admin approves/rejects + sets IsVerified + VerifiedBadge.<br/>• On approval: update `IsVerified=true` on the relevant entity (Guide/Agency/EventPlanner). |
| **FE** | • **Verified Badge** component — blue checkmark shown on profiles, listings, plans, cards.<br/>• Admin dashboard: Verification queue with document preview + approve/reject buttons.<br/>• User dashboard: Verification status card (pending/approved/rejected). |

### 2.2 Hotels

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `003_CreateHotels`**:<br/>• `Hotels` — Id, UserId, Name, Description, Address, City, Lat, Lng, PricePerNight, StarRating, Amenities (JSONB), IsAvailable.<br/>• `HotelRooms` — Id, HotelId, RoomType, Price, MaxGuests, IsAvailable. |
| **BE** | • CRUD + room management + basic availability check. |
| **FE** | • `/hotel/[id]` — full-width hero gallery, room cards, amenity icon grid, embedded map, reviews. |

### 2.3 Vehicles

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `004_CreateVehicles`**:<br/>• `Vehicles` — Id, UserId, Model, Type, SeatCount, PricePerDay, PricePerHour, IsAvailable, Description. |
| **BE** | • CRUD endpoints. |
| **FE** | • `/vehicle/[id]` — specs grid, pricing table, gallery, reviews. |

### 2.4 Restaurants

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `005_CreateRestaurants`**:<br/>• `Restaurants` — Id, UserId, Name, CuisineType, Address, City, Description, PriceRange, IsAvailable. |
| **BE** | • CRUD endpoints. |
| **FE** | • `/restaurant/[id]` — menu highlights, cuisine tags, gallery. |

### 2.5 🆕 Attractions & Points of Interest

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `006_CreateAttractions`**:<br/>• `Attractions` — Id, Name, Description, Category (temple/beach/waterfall/park/heritage), Address, City, Lat, Lng, EntryFee, OpeningHours, CoverImageUrl. |
| **BE** | • `GET /api/attractions` (filter by category, city), `GET /api/attractions/{id}`. |
| **FE** | • `/attraction/[id]` — immersive hero image, info grid, map pin, "Add to Plan" button.<br/>• Category filter chips with icons. |

### 2.6 🆕 Events & Festivals (Public) + Event Planner Role

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `007_CreateEvents`**:<br/>• `Events` — Id, Name, Description, EventDate, EndDate, Location, City, Category (festival/perahera/cultural/sports/wedding/corporate/group_travel 🆕), CoverImageUrl, IsRecurring, **PlannerId (FK, nullable)** 🆕, Price, Images (JSONB), Status (draft/published).<br/>• Public events (festivals etc.) can be admin-created.<br/>• Planner events (weddings/corporate) are created by `event_planner` role. |
| **BE** | • `GET /api/events` (public, filter by date/city/category), `GET /api/events/{id}`.<br/>• `POST /api/events` — **event_planner or admin** only.<br/>• `PUT /api/events/{id}`, `DELETE /api/events/{id}` — owner only. |
| **FE** | • `/events` — timeline or calendar view with animated cards.<br/>• `/events/[id]` — event detail with countdown timer. "Happening Now" badge on homepage.<br/>• Event Planner dashboard: My Events, Create Event (wedding/corporate/group travel), Bookings. |

### 2.7 Image/Media System

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `008_CreateImages`**:<br/>• `Images` — Id, Url, ThumbnailUrl, EntityType, EntityId, SortOrder, UploadedAt. |
| **BE** | • **Local File Storage Service** — saves files to `/uploads/{entityType}/{entityId}/` on the VPS filesystem.<br/>• Generates thumbnails server-side (ImageSharp NuGet).<br/>• Serves images via `/api/images/{id}` or directly through Nginx static file serving.<br/>• `POST /api/images/upload` — accepts multipart file + entity reference, validates size/type, returns URL.<br/>• File size limit: 5MB per image, accepted types: jpg/png/webp. |
| **FE** | • `Gallery` — masonry grid with lightbox (Framer Motion `layoutId` for shared element transitions).<br/>• Image upload widget with drag-drop zone + preview thumbnails + progress bar. |

### 2.8 Search & Discovery

| Layer | Tasks |
|:---|:---|
| **DB** | • GIN indexes on Name, City, Description across all tables. |
| **BE** | • `GET /api/search?q=&type=&minPrice=&maxPrice=&sort=` — unified search. |
| **FE** | • `/search` — animated sidebar filters, sort, card grid with staggered reveal.<br/>• **Instant search**: Debounced input with dropdown suggestion preview.<br/>• Skeleton loaders for all grids. |

---

## Phase 3 — Smart Trip Planner & Costing Engine

### 3.1 Itinerary Data Model

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `009_CreateItinerarySystem`**:<br/>• `Itineraries` — Id, UserId, Name, Notes, Status (draft/published), TotalCost, CreatedAt, UpdatedAt.<br/>• `ItineraryDays` — Id, ItineraryId, DayNumber, Date, DailyNote, DailyCost.<br/>• `ItineraryItems` — Id, DayId, ItemType (guide/hotel/vehicle/restaurant/attraction), ReferenceId, SortOrder, StartTime, EndTime, Cost, Notes, Metadata (JSONB). |
| **BE** | • `POST /api/itineraries` — tourist creates private itinerary.<br/>• `GET /api/itineraries/{id}`, `PUT /api/itineraries/{id}` (batch), `DELETE`.<br/>• `POST /api/itineraries/{id}/copy` — tourist copies agency tour plan.<br/>• ⚠️ **Tour Plans** (`POST /api/plans`) — restricted to `travel_agency` role only. Guides CANNOT create plans. |

### 3.2 Pricing / Costing Engine

| Layer | Tasks |
|:---|:---|
| **BE** | • `CostCalculationService`: Guide (daily/hourly), Vehicle (per day), Hotel (per night), Restaurant (flat), Attraction (fixed entry fee).<br/>• Daily + Total cost auto-calculated server-side. |
| **FE** | • **Sticky Cost Sidebar**: Animated number transitions (`motion.span` with `layout`), expandable daily breakdown, currency formatted. |

### 3.3 Planner UI (Premium UX)

| Layer | Tasks |
|:---|:---|
| **FE** | • **3-column desktop**: Day selector (left), Timeline DND (center), Search/Add panel (right).<br/>• **Mobile**: Swipeable day tabs + vertical timeline + sticky bottom bar (total + Book).<br/>• **DND**: `dnd-kit` with smooth `layoutAnimation` on reorder. Drop zone highlight with pulsing border.<br/>• **Item Cards**: Image + Name + Price + Rating. Slide-in animation on add, fade-out on remove.<br/>• **Inline Editing**: Click-to-edit itinerary name and day notes with smooth focus transitions.<br/>• **Auto-save**: Zustand → debounced API + LocalStorage fallback. "Saved ✓" toast on sync.<br/>• **Time Conflict Warning**: Red highlight with shake animation if items overlap.<br/>• **Map Preview**: Pinned locations per day (Leaflet/Google Maps), animated route line between stops.<br/>• **Empty State**: Illustrated empty planner with CTA "Start adding items from the search panel →". |

### 3.4 🆕 Itinerary Sharing & Export

| Layer | Tasks |
|:---|:---|
| **BE** | • `POST /api/itineraries/{id}/share` — generate a shareable public link (UUID-based slug).<br/>• `GET /api/itineraries/shared/{slug}` — read-only public view. |
| **FE** | • **Share button**: Copy link + social media share (WhatsApp, Facebook).<br/>• **PDF Export**: Client-side generation of itinerary summary (html2canvas + jsPDF). |

---

## Phase 4 — Bookings, Reviews & Dashboards

### 4.1 Booking System

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `010_CreateBookings`**:<br/>• `Bookings` — Id, UserId, ItineraryId (nullable), TourPlanId (nullable), Status, TotalPrice, NumberOfPeople, StartDate, EndDate, Notes, CreatedAt.<br/>• `Payments` (stub) — Id, BookingId, Amount, Method, Status, PaidAt. |
| **BE** | • `POST /api/bookings` — validate + price breakdown.<br/>• `GET /api/bookings`, `PUT /api/bookings/{id}/status`. |
| **FE** | • **Booking Stepper UI**: Animated multi-step (Summary → Travelers → Price Breakdown → Confirm) with progress bar.<br/>• Status badges with color-coded pills (Pending=amber, Confirmed=green, Cancelled=red). |

### 4.2 Review & Rating System

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `011_CreateReviews`**:<br/>• `Reviews` — Id, UserId, TargetType, TargetId, BookingId (optional), Rating (1-5), Comment, CreatedAt. |
| **BE** | • `POST /api/reviews`, `GET /api/reviews`. Recalculate average rating. |
| **FE** | • **Star Rating**: Interactive with bouncy fill animation (`spring` transition).<br/>• Review cards with user avatar, rating stars, and relative time.<br/>• Write review: accessible from completed bookings. |

### 4.3 🆕 Wishlist / Favorites

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `012_CreateWishlists`**:<br/>• `Wishlists` — Id, UserId, EntityType, EntityId, CreatedAt. |
| **BE** | • `POST /api/wishlist`, `GET /api/wishlist`, `DELETE /api/wishlist/{id}`. |
| **FE** | • **Heart icon** on all cards — animated fill on click (`scale` bounce + color transition).<br/>• `/dashboard/wishlist` — saved items grid with "Add to Plan" quick action. |

### 4.4 Role-Based Dashboards (Updated RBAC)

| Layer | Tasks |
|:---|:---|
| **FE** | • `/dashboard` — role-based:<br/>  — **Tourist**: My Trips, My Bookings, My Reviews, My Wishlist.<br/>  — **Guide**: Profile only, Received Bookings, Reviews. ⚠️ No "Create Plan" — show "Upgrade to Agency" CTA. Pending Agency Invitations.<br/>  — **Travel Agency** 🆕: Agency Profile, My Guides (invite/manage), My Tour Plans (create/assign guide), Received Bookings, Earnings, Verification Status.<br/>  — **Event Planner** 🆕: My Events (create/manage), Event Bookings, Verification Status.<br/>  — **Hotel/Vehicle/Restaurant Owner**: Listing, Bookings, Reviews.<br/>  — **Admin**: User management, **Verification Queue** 🆕 (approve/reject agencies/guides/planners), Platform stats.<br/>• **Dashboard Stats Cards**: Animated count-up numbers with icon backgrounds. |
| **BE** | • `GET /api/dashboard/stats` — role-specific summary.<br/>• Updated RBAC middleware for all new roles. |

### 4.5 Contact Provider & Messaging

| Layer | Tasks |
|:---|:---|
| **BE** | • `POST /api/messages`, basic store (future-ready for SignalR chat). |
| **FE** | • "Contact" button → AuthModal guard → slide-up message form panel. |

### 4.6 🆕 Notifications System

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `013_CreateNotifications`**:<br/>• `Notifications` — Id, UserId, Type (booking_confirmed, new_review, new_message), Title, Body, IsRead, CreatedAt. |
| **BE** | • `GET /api/notifications`, `PUT /api/notifications/{id}/read`.<br/>• Auto-create on booking status change, new review, new message. |
| **FE** | • **Bell icon** in Navbar with unread count badge (animated bounce on new).<br/>• Dropdown notification panel with slide-down animation. |

---

## Phase 5 — Tourism Ecosystem Extras

### 5.1 🆕 Currency Converter Widget

| Layer | Tasks |
|:---|:---|
| **FE** | • Floating currency converter button (LKR ↔ USD/EUR/GBP).<br/>• Uses free exchange rate API. Shows converted prices inline on hover. |

### 5.2 🆕 Weather Widget

| Layer | Tasks |
|:---|:---|
| **FE** | • Weather card on destination/attraction pages — current temp, forecast icons (OpenWeatherMap API).<br/>• "Best time to visit" badge based on historical data. |

### 5.3 🆕 Emergency & Travel Info

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `014_CreateTravelInfo`**:<br/>• `TravelTips` — Id, Category (safety/visa/transport/health), Title, Content, SortOrder. |
| **BE** | • `GET /api/travel-info` — returns categorized tips. |
| **FE** | • `/travel-info` page — accordion sections with icons (Emergency numbers, Visa info, Health tips, Transport guide).<br/>• Quick-access footer link. |

### 5.4 🆕 Social Sharing & SEO

| Layer | Tasks |
|:---|:---|
| **FE** | • **Open Graph meta tags** for all public pages (guide, hotel, plan, attraction, event).<br/>• **Share buttons** on all detail pages (WhatsApp, Facebook, Twitter, Copy Link).<br/>• Structured data (JSON-LD) for `TouristAttraction`, `Hotel`, `LocalBusiness` schemas.<br/>• Sitemap generation for all public routes. |

### 5.5 🆕 Blog / Travel Stories

| Layer | Tasks |
|:---|:---|
| **DB** | **Migration `015_CreateBlog`**:<br/>• `BlogPosts` — Id, AuthorId, Title, Slug, Content (Markdown/HTML), CoverImageUrl, Tags (text[]), IsPublished, PublishedAt. |
| **BE** | • `GET /api/blog`, `GET /api/blog/{slug}`, `POST /api/blog` (admin/guide). |
| **FE** | • `/blog` — card grid with featured post hero.<br/>• `/blog/[slug]` — full article with related attractions/plans sidebar. |

---

## Phase 6 — Performance, Polish & Future-Ready

### 6.1 Performance

| Layer | Tasks |
|:---|:---|
| **BE** | • Paginated APIs, response caching, `.AsNoTracking()`, projections. |
| **FE** | • SSR/ISR for SEO pages. `next/image` with blur placeholders. Debounced search. `React.memo` where needed. Route-based code splitting. |

### 6.2 Advanced Polish

| Layer | Tasks |
|:---|:---|
| **FE** | • **Dark Mode Toggle**: CSS variables switch with smooth transition.<br/>• **Scroll Progress Bar**: Thin primary-colored bar at top of page.<br/>• **Back-to-Top Button**: Fade-in floating button after 300px scroll.<br/>• **Loading Screen**: Branded spinner/logo animation on initial load.<br/>• **404 Page**: Illustrated Sri Lanka-themed "Lost in Paradise" page.<br/>• **Empty States**: Illustrated empty states for all lists with CTAs.<br/>• **Confetti Animation**: On successful booking confirmation. |

### 6.3 VPS Deployment Strategy

| Component | Setup Details |
|:---|:---|
| **VPS** | Ubuntu 22.04 LTS (or similar). Minimum: 2 vCPU, 4GB RAM, 50GB SSD. |
| **PostgreSQL** | Install directly on VPS or use Docker container. Daily `pg_dump` backups to `/backups/`. |
| **.NET API** | Publish as self-contained Linux binary. Run via `systemd` service (`sriguide-api.service`). Listens on `localhost:5000`. |
| **Next.js** | Build with `npm run build`. Run via `pm2` or `systemd`. Listens on `localhost:3000`. |
| **Nginx** | Reverse proxy: `sriguide.lk` → Next.js `:3000`, `api.sriguide.lk` (or `/api`) → .NET `:5000`.<br/>Serve `/uploads` as static files directly: `location /uploads/ { alias /var/www/sriguide/uploads/; }`. |
| **SSL** | Free certificates via **Let's Encrypt** (`certbot`). Auto-renewal cron. |
| **Image Storage** | All uploads saved to `/var/www/sriguide/uploads/{entityType}/{entityId}/{filename}`.<br/>Nginx serves them as static assets for maximum performance (no API overhead).<br/>**next.config.ts**: Add VPS domain to `images.remotePatterns` for `next/image` optimization. |
| **Firewall** | `ufw` — allow 80, 443, 22 only. |
| **Monitoring** | `htop` for resources; optional Uptime Kuma for health checks. |

### 6.4 Future Upgrade Hooks

| Feature | Preparation |
|:---|:---|
| **AI Planner** | Itinerary model supports auto-population; add service interface stub. |
| **Tourist ↔ Guide Chat** | Messages table ready; add SignalR hub stub. |
| **Real-time Availability** | IsAvailable fields present; add date-range availability table stub. |
| **Mobile App** | API-first design is ready. |
| **Multi-language (i18n)** | Use `next-intl`; prepare translation JSON stubs for EN/SI. |
| **Payment Gateway** | Payments table is stubbed; add Stripe/PayHere integration point. |

---

## 🔐 RBAC Permissions Matrix

| Action | Tourist | Guide | Travel Agency | Event Planner | Hotel/Vehicle/Restaurant | Admin |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| Browse listings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Book services | ✅ | — | — | — | — | — |
| Leave reviews | ✅ | — | — | — | — | — |
| Save to wishlist | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| **View contact details** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View contact details (anonymous) | ❌ | — | — | — | — | — |
| Create itinerary | ✅ | — | — | — | — | — |
| Manage guide profile | — | ✅ | — | — | — | — |
| Create tour plans | ❌ | ❌ | ✅ | — | — | — |
| Invite/manage guides | — | — | ✅ | — | — | — |
| Apply for agency upgrade | — | ✅ | — | — | — | — |
| Accept agency invite | — | ✅ | — | — | — | — |
| Create/manage events | — | — | — | ✅ | — | ✅ |
| Manage own listing | — | — | — | — | ✅ | — |
| Approve verifications | — | — | — | — | — | ✅ |
| Manage all users | — | — | — | — | — | ✅ |

---

## ⚠️ Important Rules

| Rule | Detail |
|:---|:---|
| 🔒 **Contact details require login** | Phone, email, and WhatsApp of all providers (guides, agencies, hotels, vehicles, restaurants, event planners) are **hidden for anonymous users**. Backend returns `contactDetails: null` if no auth token. Frontend shows a blurred placeholder with "Login to see contact info" CTA that triggers `AuthModal`. |
| 👁️ **Everything else is public** | Listings, profiles, photos, reviews, ratings, prices, tour plans, events, attractions — all viewable without login. |

---

## ⚠️ Anti-Patterns to Avoid

| Rule | Reason |
|:---|:---|
| ❌ Don’t force login for browsing | Tourists must browse freely |
| ❌ Don’t expose contact info publicly | Require login to protect provider privacy |
| ❌ Don’t mix planner + booking logic | Keep services decoupled |
| ❌ Don’t store prices only in frontend | Backend = source of truth |
| ❌ Don’t skip provider verification | Trust is critical |
| ❌ Don’t ignore image performance | CDN + `next/image` everywhere |
| ❌ Don’t break existing styles | Extend, don’t replace |

---

## Migration Summary

| # | Migration | Tables |
|:---|:---|:---|
| 001 | CreateUsersAndRoles | Users, RefreshTokens (roles include travel_agency, event_planner) |
| 002 | CreateGuides | Guides (with AgencyId FK) |
| 002b | CreateAgencies 🆕 | AgencyProfiles, AgencyGuides, TourPlans (AgencyId FK) |
| 002c | CreateVerifications 🆕 | Verifications |
| 003 | CreateHotels | Hotels, HotelRooms |
| 004 | CreateVehicles | Vehicles |
| 005 | CreateRestaurants | Restaurants |
| 006 | CreateAttractions | Attractions |
| 007 | CreateEvents | Events (with PlannerId FK, expanded categories) |
| 008 | CreateImages | Images |
| 009 | CreateItinerarySystem | Itineraries, ItineraryDays, ItineraryItems |
| 010 | CreateBookings | Bookings, Payments |
| 011 | CreateReviews | Reviews |
| 012 | CreateWishlists | Wishlists |
| 013 | CreateNotifications | Notifications |
| 014 | CreateTravelInfo | TravelTips |
| 015 | CreateBlog | BlogPosts |

---

## API Endpoint Summary

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/refresh` | Public | Refresh token |
| POST | `/api/auth/logout` | Logged In | Logout |
| GET | `/api/guides` | Public | List guides |
| GET | `/api/guides/{id}` | Public | Guide detail |
| POST | `/api/guides` | Guide | Create/update profile |
| POST | `/api/agency/apply` | Guide | Apply to upgrade to travel_agency 🆕 |
| GET | `/api/agency/me` | Agency | Get agency profile 🆕 |
| POST | `/api/agency/invite-guide` | Agency | Invite a guide 🆕 |
| POST | `/api/agency/accept-invite` | Guide | Accept agency invitation 🆕 |
| GET | `/api/agency/guides` | Agency | List managed guides 🆕 |
| POST | `/api/plans` | Agency | Create tour plan (agency only) 🔄 |
| PUT | `/api/plans/{id}/assign-guide` | Agency | Assign guide to plan 🆕 |
| GET | `/api/hotels` | Public | List hotels |
| GET | `/api/hotels/{id}` | Public | Hotel detail |
| POST | `/api/hotels` | Hotel Owner | Create/update hotel |
| GET | `/api/vehicles` | Public | List vehicles |
| POST | `/api/vehicles` | Vehicle Owner | Create/update vehicle |
| GET | `/api/restaurants` | Public | List restaurants |
| POST | `/api/restaurants` | Restaurant Owner | Create/update |
| GET | `/api/attractions` | Public | List attractions |
| GET | `/api/attractions/{id}` | Public | Attraction detail |
| GET | `/api/events` | Public | List events |
| GET | `/api/events/{id}` | Public | Event detail |
| POST | `/api/events` | Event Planner/Admin | Create event 🆕 |
| PUT | `/api/events/{id}` | Owner | Update event 🆕 |
| GET | `/api/plans` | Public | Browse tour plans |
| GET | `/api/plans/{id}` | Public | Plan detail |
| GET | `/api/search` | Public | Unified search |
| POST | `/api/itineraries` | Tourist | Create itinerary |
| GET | `/api/itineraries/{id}` | Owner | Get itinerary |
| PUT | `/api/itineraries/{id}` | Owner | Batch update |
| POST | `/api/itineraries/{id}/copy` | Tourist | Clone guide plan |
| POST | `/api/itineraries/{id}/share` | Owner | Generate share link |
| GET | `/api/itineraries/shared/{slug}` | Public | View shared itinerary |
| POST | `/api/bookings` | Tourist | Create booking |
| GET | `/api/bookings` | Logged In | List bookings |
| PUT | `/api/bookings/{id}/status` | Provider | Confirm/cancel |
| POST | `/api/reviews` | Tourist | Submit review |
| GET | `/api/reviews` | Public | List reviews |
| POST | `/api/wishlist` | Logged In | Add to wishlist |
| GET | `/api/wishlist` | Logged In | My wishlist |
| DELETE | `/api/wishlist/{id}` | Logged In | Remove from wishlist |
| GET | `/api/notifications` | Logged In | My notifications |
| PUT | `/api/notifications/{id}/read` | Logged In | Mark read |
| POST | `/api/verification/submit` | Provider | Submit verification docs 🆕 |
| GET | `/api/admin/verifications` | Admin | List pending verifications 🆕 |
| POST | `/api/admin/verify` | Admin | Approve/reject verification 🆕 |
| POST | `/api/images/upload` | Provider | Upload image |
| POST | `/api/messages` | Tourist | Contact provider |
| GET | `/api/travel-info` | Public | Travel tips |
| GET | `/api/blog` | Public | Blog posts |
| GET | `/api/blog/{slug}` | Public | Blog detail |
| POST | `/api/blog` | Admin/Guide | Create post |

---

## Frontend Page Map

| Route | Auth | Description |
|:---|:---|:---|
| `/` | Public | Home — Hero, Discover, Popular Tours, Guides, Places, Events |
| `/search` | Public | Unified search with filters |
| `/guide/[id]` | Public | Guide profile, tours, reviews |
| `/hotel/[id]` | Public | Hotel detail, rooms, reviews |
| `/vehicle/[id]` | Public | Vehicle detail, reviews |
| `/restaurant/[id]` | Public | Restaurant detail |
| `/attraction/[id]` | Public | Attraction detail + map |
| `/events` | Public | Events calendar/timeline |
| `/events/[id]` | Public | Event detail + countdown |
| `/plan/[id]` | Public | Tour plan detail |
| `/itinerary` | Tourist | Smart Trip Planner (DND) |
| `/itinerary/shared/[slug]` | Public | Read-only shared itinerary |
| `/dashboard` | Logged In | Role-based dashboard |
| `/dashboard/wishlist` | Logged In | Saved favorites |
| `/agency/upgrade` | Guide | Upgrade to Travel Agency form 🆕 |
| `/dashboard/agency` | Agency | Manage guides + tour plans 🆕 |
| `/dashboard/events` | Event Planner | Manage events 🆕 |
| `/tours` | Public | Browse all tours |
| `/travel-info` | Public | Safety, visa, health tips |
| `/blog` | Public | Travel stories |
| `/blog/[slug]` | Public | Blog article |
