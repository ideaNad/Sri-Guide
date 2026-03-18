# SriGuide.lk — MVP 1 Implementation Plan

This plan defines the core "Minimum Viable Product" focus to get the platform live with its essential marketplace dynamics: Tourists discovering and connecting with Guides and Travel Agencies.

---

## 🎯 MVP 1 Core Objectives

1.  **Identity & Access**: Secure registration for Tourists, Guides, and Travel Agencies.
2.  **The Marketplace**: Public discovery of Guides and Agencies with filtering.
3.  **Trust & Roles**: Guide-to-Agency upgrade path and Agency-managed guide associations.
4.  **Privacy-First Contact**: Contact info (Phone, Email, WhatsApp) locked behind login.
5.  **Community Feedback**: Star ratings and reviews (LoggedIn only to submit).

---

## 🛠️ Technical Scope

### 1. Foundation & Auth (Phase 1)
- **Roles**: `tourist`, `guide`, `travel_agency`, `admin`.
- **Registration**: Email/Password + Role Selection.
- **Login**: JWT-based session.
- **Email Service**: Basic welcome email + password reset.

### 2. Profile Management (Phase 2)
- **Guide Profile**: Bio, Speaking Languages (multi-select), License Info.
- **Agency Profile**: Company Name, Registration Number, Company Email, Phone, WhatsApp.
- **The Upgrade Flow**: Guide dashboard has a "Become an Agency" CTA → Submits company docs → Admin approves → Role changes to `travel_agency`.
- **Agency-Guide Association**: Agency can search and invite existing Guides → Guide accepts → Guide is listed under Agency.

### 3. Discovery & Interaction (Phase 3)
- **Listing Page**: Grid/List view of all Guides and Agencies.
- **Search/Filter**: Filter by Type (Guide/Agency), Languages, Rating.
- **Public Detail Page**: Bio, Languages, Photos, Ratings/Reviews (Publicly viewable).
- **Protected Contact Info**: Mobile, WhatsApp, and Email are **blurred/hidden** for anonymous users. "Login to View Contact" button triggers Auth Modal.
- **Rating System**: Tourists can see ratings, but the "Submit Review" form is only accessible after login.

---

## 🗄️ Database Schema changes for MVP

- `Users`: Add `Role`, `IsVerified`.
- `Guides`: `Languages` (string array), `AgencyId` (nullable FK).
- `AgencyProfiles`: `CompanyName`, `RegistrationNumber`, `CompanyEmail`, `Phone`, `WhatsApp`, `Status`.
- `Reviews`: `UserId`, `TargetId`, `Rating`, `Comment`.

---

## 🎨 UI/UX MVP Focus (Premium Finish)

- **Premium Shell**: Glassmorphism Header with sticky blur, smooth Page Transitions using `AnimatePresence`.
- **Micro-interactions**: 
    - Bouncy Hover on Cards (`scale: 1.05`).
    - Staggered card entrance for search results.
    - Animated "Verified" badge appearing with a subtle spin.
- **Auth Modal**: Elegant tabbed interface with a slide-and-fade animation for role selection.
- **Toasts**: `Sonner` based high-quality notifications for login success or review submission.
- **Privacy Shade**: Contact details are "shuffled" or "blurred" until login, with a smooth reveal animation once athenticated.

---

## 🎨 Premium Design System (Marketplace Aesthetics)

- **Vibrant Color Palette**:
  - **Primary**: `#00BFA5` (Sri Lankan Teal/Emerald) — representing the lush nature.
  - **Secondary**: `#FFD600` (Golden Sands) — representing the beaches.
  - **Accents**: `#FF5252` (Coral Pink) — for urgent actions/notifications.
  - **Dark Mode**: Deep Navy `#0F172A` with Slate-900 backgrounds.
- **Modern Typography**:
  - **Headings**: `Outfit` or `Plus Jakarta Sans` — bold, geometric, and friendly.
  - **Body**: `Inter` — for maximum readability and a clean "app" feel.
- **Glassmorphism Spec**:
  - Cards: `bg-white/70 backdrop-blur-lg border border-white/20`.
  - Floating Navbar: `bg-black/10 backdrop-blur-xl`.
- **Dynamic Interactions**:
  - **Magnetic Buttons**: Slight pull towards the cursor when hovered.
  - **Smooth Scrolling**: Lenis-powered velocity scroll.


---

## 🏁 MVP 1 Success Criteria
- A Tourist can register, log in, filter for a Guide speaking "English & German", and see their WhatsApp number.
- A Guide can upgrade to an Agency and invite 3 other guides to their team.
- Admin can review documents in a dedicated queue and toggle the "Verified" status with a single click.
