# 13 Assignment Compliance

Authority: `PROJECT_BIBLE.md`

This file summarizes assignment compliance. The full traceability source remains the Phase 1 requirement traceability matrix.

## Completed Through Phase 10 Part 1

- React Native Expo project created.
- Expo Router installed and configured.
- TypeScript configured.
- Firebase package installed.
- Firebase foundation created with modular SDK service wrappers and Expo environment configuration.
- Firebase Email/Password authentication implemented.
- Firestore repository architecture implemented for customer, vendor, and admin modules.
- React Hooks and Context API structure implemented.
- Engineering handbook, design tokens, and reusable component library created.
- Customer auth, browsing, ordering UI, profile, account, support, notifications UI, reviews, coupons, offers, recently viewed, recommended, filters, sorting, loading states, error states, and timeline tracking UI built.
- Vendor login, dashboard, restaurant profile, menu, food, category, order, coupon/offer, analytics, and settings screens created.
- Administrator login, dashboard, profile, user management, customer management, vendor management, rider management, restaurant approval, restaurant details, food management, category management, order management, order details, coupon management, offers management, reviews moderation, reports, analytics, platform settings, and role management screens created.
- Firestore rules updated for customer ownership, vendor restaurant ownership, admin access, payment records, notifications, Storage paths, and rider assigned-order access.
- Firebase Storage image upload helpers created.
- Firestore-backed cart persistence, checkout order creation, dummy payment logic, Firestore notifications, realtime order listeners, and rider placeholder workflow implemented.
- Phase 10 Part 1 submission audit completed and critical missing required routes added for customer payment, admin add food, admin payments, and admin notifications.

## Not Yet Implemented

- Backend/API calls.
- Real payment gateway or real payment processing.
- Real notification delivery or push notifications.
- GPS, Google Maps, or live order tracking.
- Screenshots, report, and presentation slides.

## Current Order Tracking Compliance Direction

The order tracking requirement is represented by a professional delivery timeline interface. The current application must not use Google Maps, GPS, or a live map for order tracking.

## Phase 8 Admin Compliance

- Admin-only route group created under `app/(admin)/`.
- Non-admin users are denied by the admin access guard.
- Admin repositories/hooks support users, restaurants, foods, categories, orders, coupons, offers, reviews, analytics, reports, settings, and role management.
- Firestore rules allow admins to access all collections while retaining customer and vendor restrictions.
- Real payment gateway, push notification delivery, backend APIs, GPS, Google Maps, and live tracking remain unimplemented.

## Rule

No assignment requirement may be marked fully complete until it is implemented, tested, and evidenced in a future phase handoff.

## Phase 9 Production Features & Service Integration

Phase 9 adds production-service foundations while preserving the existing customer, vendor, admin, authentication, Firestore repository, role access, and documentation architecture.

Implemented scope:

- Firebase Storage image upload helpers with progress, loading, success, and error states.
- Firestore-backed cart-to-order checkout workflow.
- Dummy payment records for Cash on Delivery, Dummy Mobile Money, and Dummy Card Payment.
- Firestore notification records for order and payment events, plus promotion support.
- Realtime Firestore order listeners for timeline/status tracking.
- Rider workflow placeholder using assigned deliveries and status updates.
- Security rules updates for payments, notifications, Storage paths, and rider assigned-order access.

Out of scope remains unchanged: no real payment gateway, no backend APIs, no push notifications, no GPS, no Google Maps, and no live map tracking. Order tracking remains timeline/status based.

Detailed guides: `docs/FIREBASE_SETUP.md`, `docs/STORAGE_GUIDE.md`, `docs/PAYMENT_FLOW.md`, `docs/ORDER_WORKFLOW.md`, and `docs/NOTIFICATIONS_GUIDE.md`.




## Phase 10 Part 2 Submission Package

Created final submission documentation: README improvements, database structure, Firebase setup guide, screenshot checklist, submission checklist, project report, and presentation slide outline.

The remaining tasks are manual screenshot capture, optional report/slide export to lecturer-required formats, Firebase demo configuration check, and final upload packaging.

