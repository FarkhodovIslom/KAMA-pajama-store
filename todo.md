# KAMA Pajama Store - Remaining Tasks

This document contains a comprehensive list of remaining tasks after the major frontend refactor to the new pastel pink design system.

## 1. Admin Panel Translation & Styling (High Priority)
- [ ] Translate all remaining admin pages from Uzbek to Russian (`admin/login`, `admin/orders`, `admin/products`, `admin/categories`, `admin/settings`).
- [ ] Ensure all admin panel components use the new `admin-font-override` class correctly so that they don't inherit the `Borel` cursive font for headings.
- [ ] Check padding, margins, and card styles in the admin panel to ensure they match the clean, modern aesthetic of the public site while utilizing standard dashboard layouts.
- [ ] Update table styles, form inputs, and buttons in the admin panel to use the `globals.css` variable system (e.g., `var(--primary)`, `var(--surface)`).

## 2. Embla Carousel Integration
- [ ] Replace the current simple thumbnail gallery in `ProductDetails.tsx` with `embla-carousel-react`.
- [ ] Implement smooth swipe gestures for mobile users on the product details page.
- [ ] Add navigation buttons (prev/next) and pagination dots for the carousel.
- [ ] Ensure the carousel handles different image aspect ratios gracefully within the product card and detail views.

## 3. Mobile Navigation & Drawer Polish
- [ ] Implement a mobile drawer for the `FilterSidebar` component on the catalog page. Currently, the sidebar might be stacked or hidden on mobile; it needs a dedicated floating 'Filter' button that opens a sliding drawer.
- [ ] Ensure the `MobileMenu` transitions and closing behaviors are perfectly smooth, matching the new CSS-only transition approach.
- [ ] Verify that `BottomNav` is always visible and functional on mobile devices without overlapping content (utilize `pt-safe` and `pb-safe` utilities).

## 4. Final Review & Bug Fixes
- [ ] Perform a full UI audit across all pages (Home/Catalog, Product, Search, Cart, Admin).
- [ ] Check all interactive states (hover, focus, active, disabled) on buttons and links.
- [ ] Validate form submissions (Cart checkout, Admin login, Admin CRUD operations) to ensure error states and success toasts are displaying correctly in Russian.
- [ ] Remove any lingering `framer-motion` or `swiper` dependencies from `package.json` if not already fully removed, and run `npm uninstall` for cleanup.
- [ ] Run `npm run build` one last time to ensure no TypeScript or ESLint errors persist.
