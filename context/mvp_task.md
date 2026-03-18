# Task Checklist: SriGuide.lk MVP 1

### Phase 1: Foundation & Auth
- [ ] **Infrastructure Setup**
    - [ ] .NET Clean Architecture solution setup
    - [ ] DB: PostgreSQL `sriguide_db` creation
- [ ] **User Auth & Roles**
    - [ ] DB: Migration 001 — Users (Id, Name, Email, Role: `tourist`, `travel_guide`, `travel_agency`, `admin`)
    - [ ] BE: Register/Login API for all 3 roles
    - [ ] FE: Auth Modal (Login/Signup) with Glassmorphism
- [ ] **UI Shell**
    - [ ] FE: Navbar with Role-based links
    - [ ] FE: Framer Motion Page Transitions

### Phase 2: Profiles & Relationships
- [ ] **Travel Guide Profiles**
    - [ ] DB: `Guides` table with `SpeakingLanguages` (string array)
    - [ ] BE: Update Guide Profile API (including languages)
    - [ ] FE: Guide Profile Page (Bio, Languages)
- [ ] **Travel Agency System**
    - [ ] DB: `AgencyProfiles` (CompanyName, RegNumber, Email, Phone, WhatsApp)
    - [ ] BE: Upgrade Path (Guide -> Agency)
    - [ ] BE: Admin approval logic for Agencies
    - [ ] BE: Agency Invite Guide API
    - [ ] BE: Guide Accept Invite API
    - [ ] FE: Agency Multi-step Upgrade Form
    - [ ] FE: Agency Dashboard (Manage Guides)

### Phase 3: Marketplace & Privacy
- [ ] **Discovery**
    - [ ] BE: Unified Search/Filter (Type: Guide/Agency, Language, Rating)
    - [ ] FE: Search Result Page with Premium Cards
- [ ] **Contact Visibility (Privacy Power)**
    - [ ] BE: Conditional response logic (Hide phones/emails for anonymous)
    - [ ] FE: Blurred contact placeholders + Auth trigger button
- [ ] **Reviews & Ratings**
    - [ ] DB: `Reviews` table
    - [ ] BE: Submit Review API (Auth required)
    - [ ] FE: Star Rating Component (View=Public, Submit=Auth)

### Phase 4: Final Polish & Deployment
- [ ] FE: Responsive Mobile optimization
- [ ] VPS: Nginx configuration for static assets (/uploads)
- [ ] VPS: .NET API & Next.js Deployment
