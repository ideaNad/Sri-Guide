You are a senior frontend architect and UI/UX expert.

Project: sriguide.lk — Tourism marketplace platform (Next.js frontend already exists)

⚠️ CRITICAL RULES:

* DO NOT break existing UI styles or layout
* DO NOT rewrite entire components unnecessarily
* ONLY enhance, refine, and extend existing design
* Maintain current color scheme and branding
* Improve UX without disrupting current structure

---

## 🎯 OBJECTIVE

Upgrade the frontend to:

* Look modern, premium, and production-ready
* Improve usability and user flow
* Add missing UX details
* Optimize performance and responsiveness
* Enhance the itinerary planner experience

---

## 🎨 DESIGN IMPROVEMENT GOALS

Apply:

* Clean spacing (consistent padding/margin system)
* Better typography hierarchy
* Improved card design (shadow, radius, hover effects)
* Smooth transitions and micro-interactions
* Skeleton loaders for async content
* Responsive design (mobile-first)

DO NOT:

* Change brand colors drastically
* Replace entire UI system

---

## 🧩 PLANNER UI (CORE FOCUS)

Improve / implement itinerary planner UI:

Layout:

* Left: Days list (Day 1, Day 2...)
* Center: Timeline (drag & drop area)
* Right: Search panel (guides, hotels, vehicles, places)

Enhancements:

* Drag & drop ready structure (use dnd-kit or similar)
* Live cost calculation panel (sticky sidebar)
* Visual cards for items (image + price + rating)
* Add/remove items smoothly
* Highlight selected day
* Prevent time conflicts visually

UX:

* “Add to plan” button everywhere (guides, hotels, etc.)
* Inline editing (rename itinerary, edit notes)
* Save automatically (auto-save UX)

---

## 💰 COST VISIBILITY (IMPORTANT)

Always show:

* Per-item cost
* Daily total
* Full trip total

UI:

* Sticky cost summary panel
* Expandable breakdown

---

## 🗺️ VISUAL ENHANCEMENTS

* Add map preview section (if location available)
* Show route between places (future-ready)
* Image-first design (large thumbnails)

---

## 🔐 AUTH UX IMPROVEMENT

* Allow browsing without login
* Show modal when user tries:

  * booking
  * saving itinerary
  * contacting provider

Modal:

* clean, minimal
* does not redirect immediately

---

## ⭐ RATING & TRUST UI

* Star rating component
* Verified badges
* Review preview cards

---

## ⚡ PERFORMANCE IMPROVEMENTS

* Use Next.js Image component
* Lazy load images
* Avoid unnecessary re-renders
* Optimize API calls (debounce search)

---

## 🧱 COMPONENT IMPROVEMENTS

Refactor components to be:

* Reusable
* Clean
* Typed (TypeScript)

Examples:

* Card component (guide/hotel/vehicle)
* Gallery component
* Planner item card
* Cost summary component

---

## 📱 RESPONSIVENESS

Ensure:

Mobile:

* Planner becomes vertical layout
* Sticky bottom action bar (total cost + book button)

Tablet/Desktop:

* 3-column planner layout

---

## ✨ MICRO INTERACTIONS

Add:

* Hover effects
* Smooth transitions
* Button feedback
* Loading states

---

## 🧪 OUTPUT EXPECTATION

Provide:

1. Improved component structures
2. Updated JSX examples
3. Suggested Tailwind improvements
4. Planner UI layout code (if needed)
5. UX improvements explanation
6. Identify gaps in current UI

Focus on:

* Real-world production UI
* Clean, maintainable code
* High-end SaaS feel

---

## 🎯 FINAL GOAL

Transform the existing UI into:

* A premium travel planning experience
* Easy-to-use itinerary builder
* Visually appealing and intuitive system

WITHOUT breaking current design system

---

END
