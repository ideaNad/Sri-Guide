# Task: SriGuide.lk Full Development

- [x] Audit existing UX and Plan Improvements

---

- [ ] **Phase 1 — Foundation, Auth & Premium UI Shell**
    - [ ] DB: Migration 001 — Users, RefreshTokens, Role seeding
    - [ ] BE: Clean Architecture solution setup
    - [ ] BE: Auth (Register, Login, Refresh, Logout) + Rate limiting
    - [ ] FE: `AuthModal` + `useAuth` hook
    - [ ] FE: Refactor all `img` → `next/image` with blur placeholders
    - [ ] FE: Animation system (page transitions, scroll reveals, parallax, card hover, counters)
    - [ ] FE: Base components (Button, Input, Modal, SkeletonLoader, Toast)
    - [ ] FE: Navbar active states, spacing grid, typography scale, focus rings

- [ ] **Phase 2 — Provider Ecosystem & Discovery**
    - [ ] DB: Migrations 002–008 (Guides, Hotels, Vehicles, Restaurants, Attractions, Events, Images)
    - [ ] BE: Guide CRUD + Tour Plan CRUD
    - [ ] BE: Hotel CRUD + Room management
    - [ ] BE: Vehicle, Restaurant CRUD
    - [ ] BE: Attractions & Events endpoints (🆕)
    - [ ] BE: Local filesystem image upload service (VPS `/uploads/`)
    - [ ] BE: Unified search API with GIN indexes
    - [ ] FE: All detail pages (`/guide/[id]`, `/hotel/[id]`, `/vehicle/[id]`, `/restaurant/[id]`)
    - [ ] FE: `/attraction/[id]` and `/events` pages (🆕)
    - [ ] FE: `/search` with animated filters, instant search, skeleton loaders
    - [ ] FE: Gallery with lightbox (shared element transitions)
    - [ ] FE: "Add to Plan" buttons everywhere

- [ ] **Phase 3 — Smart Trip Planner & Costing**
    - [ ] DB: Migration 009 — Itineraries, Days, Items (JSONB)
    - [ ] BE: Itinerary CRUD (batch update, copy guide plan)
    - [ ] BE: Cost Calculation Engine
    - [ ] BE: Itinerary sharing (shareable link generation) (🆕)
    - [ ] FE: 3-column Planner (Days / DND Timeline / Search Panel)
    - [ ] FE: `dnd-kit` with layout animations
    - [ ] FE: Zustand auto-save + "Saved ✓" toast
    - [ ] FE: Sticky cost sidebar with animated number transitions
    - [ ] FE: Time conflict warnings, map preview, empty states
    - [ ] FE: Share & PDF export (🆕)
    - [ ] FE: Mobile vertical layout + sticky bottom bar

- [ ] **Phase 4 — Bookings, Reviews & Dashboards**
    - [ ] DB: Migrations 010–013 (Bookings, Reviews, Wishlists, Notifications)
    - [ ] BE: Booking create/list/status update
    - [ ] BE: Review submit + average recalculation
    - [ ] BE: Wishlist CRUD (🆕)
    - [ ] BE: Notifications auto-create + list/read (🆕)
    - [ ] BE: Contact provider messaging
    - [ ] FE: Animated booking stepper (Summary → Travelers → Price → Confirm)
    - [ ] FE: Star rating with bounce animation + review cards
    - [ ] FE: Heart icon wishlist with animation (🆕)
    - [ ] FE: Navbar notification bell with badge (🆕)
    - [ ] FE: Role-based dashboards (Tourist/Guide/Hotel/Vehicle/Restaurant/Admin)

- [ ] **Phase 5 — Tourism Ecosystem Extras** (🆕)
    - [ ] DB: Migrations 014–015 (TravelTips, BlogPosts)
    - [ ] BE: Travel info & Blog endpoints
    - [ ] FE: Currency converter widget
    - [ ] FE: Weather widget on destination pages
    - [ ] FE: `/travel-info` — safety, visa, health tips
    - [ ] FE: `/blog` — travel stories
    - [ ] FE: Social sharing + Open Graph + JSON-LD structured data

- [ ] **Phase 6 — Performance, Polish, VPS Deployment & Future-Ready**
    - [ ] BE: Pagination, caching, query optimization
    - [ ] FE: SSR/ISR for SEO pages
    - [ ] FE: Dark mode toggle, scroll progress bar, back-to-top
    - [ ] FE: Branded loading screen, 404 page, confetti on booking
    - [ ] VPS: Nginx reverse proxy config (Next.js + .NET API)
    - [ ] VPS: Local filesystem image storage (`/uploads/`) served via Nginx
    - [ ] VPS: SSL (Let's Encrypt), firewall (ufw), systemd services
    - [ ] VPS: PostgreSQL backups (`pg_dump` cron)
    - [ ] Future stubs: AI Planner, SignalR chat, i18n, Payment gateway
